import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import {
  clamp01,
  createVelocityTracker,
  lerp,
  prefersReducedMotion,
  project,
  rubberband,
  useSpring,
} from "../lib/spring";

const CARD_RADIUS = 20;
const SHEET_RADIUS = 24;
const DRAG_THRESHOLD = 6;

/**
 * A project detail sheet that grows out of the card that opened it and
 * shrinks back into it. It can be dragged down to dismiss (the decision uses
 * the projected resting point, not the release point) and grabbed mid-flight.
 */
function ProjectSheet({ project: item, originEl, open, onRequestOpen, onRequestClose, onClosed }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const scrimRef = useRef(null);
  const closeButtonRef = useRef(null);

  const geometry = useRef({ s: 1, tx: 0, ty: 0, clip: 0, r0: CARD_RADIUS, height: 1 });
  const drag = useRef(null);
  const releaseVelocity = useRef(0);
  const tracker = useRef(createVelocityTracker());
  const openRef = useRef(open);
  openRef.current = open;

  const progress = useSpring(0, { response: 0.45, precision: 0.001 });
  const dragY = useSpring(0, { response: 0.35, precision: 0.1 });

  const render = useCallback(() => {
    const inner = innerRef.current;
    const scrim = scrimRef.current;
    if (!inner || !scrim) return;

    const p = progress.value;
    const y = dragY.value;
    const g = geometry.current;
    const pulledDown = Math.max(y, 0);

    scrim.style.opacity = p * 0.4 * (1 - Math.min(pulledDown / 800, 0.5));

    if (prefersReducedMotion()) {
      // Cross-fade instead of travelling; dragging still tracks 1:1.
      inner.style.opacity = p;
      inner.style.transform = `translate3d(0, ${y}px, 0)`;
      inner.style.clipPath = `inset(0 round ${SHEET_RADIUS}px)`;
      inner.style.setProperty("--detail", 1);
      return;
    }

    // The sheet gets a little smaller as you pull it, hinting it's going away.
    const dragScale = 1 - Math.min(pulledDown / 1600, 0.12);
    const s = lerp(g.s, 1, p) * dragScale;
    const tx = g.tx * (1 - p);
    const ty = g.ty * (1 - p) + y;
    const clipBottom = g.clip * (1 - p);
    const radius = lerp(g.r0, SHEET_RADIUS, p);

    inner.style.opacity = 1;
    inner.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
    inner.style.clipPath = `inset(0 0 ${clipBottom}px 0 round ${radius}px)`;
    // Text and controls arrive after the surface, so the card reads as one object.
    inner.style.setProperty("--detail", clamp01((p - 0.35) / 0.5));
  }, [progress, dragY]);

  progress.onUpdate = render;
  dragY.onUpdate = render;
  progress.onRest = (value) => {
    if (value === 0 && !openRef.current) onClosed();
  };

  // Map the sheet's resting rect onto the card's rect (origin: top center).
  const measure = useCallback(() => {
    const outer = outerRef.current;
    if (!outer || !originEl) return;
    const F = outer.getBoundingClientRect();
    const C = originEl.getBoundingClientRect();
    const s = C.width / F.width;
    geometry.current = {
      s,
      tx: C.left + C.width / 2 - (F.left + F.width / 2),
      ty: C.top - F.top,
      clip: Math.max(0, F.height - C.height / s),
      r0: CARD_RADIUS / s,
      height: F.height,
    };
  }, [originEl]);

  useLayoutEffect(() => {
    if (!item) return;
    measure();
    if (open) {
      render();
      progress.to(1, { dampingRatio: 1, response: 0.45 });
      if (!drag.current) dragY.to(0, { dampingRatio: 1 });
    } else {
      const velocity = releaseVelocity.current;
      releaseVelocity.current = 0;
      // A flick carried momentum, so a touch of bounce is earned here.
      progress.to(0, { dampingRatio: velocity ? 0.9 : 1, response: 0.42 });
      dragY.to(0, { velocity, dampingRatio: 1, response: 0.42 });
    }
  }, [open, item, measure, render, progress, dragY]);

  // Lock page scroll only while the sheet is actually open, and hand focus
  // back to the card the moment it starts closing.
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = previous;
      originEl?.focus({ preventScroll: true });
    };
  }, [open, originEl]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onRequestClose();
      if (e.key !== "Tab") return;
      const focusable = innerRef.current?.querySelectorAll("a[href], button");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onRequestClose]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // Grabbing a sheet that's on its way out brings it back.
    if (!openRef.current) onRequestOpen();
    dragY.stop();
    tracker.current.reset();
    tracker.current.add(e.clientY, e.timeStamp);
    drag.current = {
      startY: e.clientY,
      // Respect where it was grabbed: continue from the live value.
      origin: dragY.value,
      active: Math.abs(dragY.value) > 0.5,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    tracker.current.add(e.clientY, e.timeStamp);
    const delta = e.clientY - d.startY;
    if (!d.active && Math.abs(delta) < DRAG_THRESHOLD) return;
    d.active = true;
    const raw = d.origin + delta;
    dragY.set(raw >= 0 ? raw : rubberband(raw, geometry.current.height));
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active) return;
    const velocity = tracker.current.velocity(e.timeStamp);
    const projected = dragY.value + project(velocity);
    const threshold = Math.min(geometry.current.height * 0.3, 200);

    if (projected > threshold) {
      releaseVelocity.current = velocity;
      onRequestClose();
    } else {
      dragY.to(0, { velocity, dampingRatio: 0.8, response: 0.35 });
    }
  };

  if (!item) return null;

  const { img, title, liveLink, github, techStack } = item;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-8">
      <div
        ref={scrimRef}
        onClick={onRequestClose}
        className="absolute inset-0 bg-black"
        style={{ opacity: 0, pointerEvents: open ? "auto" : "none" }}
        aria-hidden
      />

      <div
        ref={outerRef}
        className="relative flex max-h-[calc(100dvh-2.5rem)] w-full sm:max-h-[calc(100dvh-4rem)] sm:max-w-[42.5rem]"
      >
        <div
          ref={innerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-sheet-title"
          className="flex w-full flex-col overflow-hidden bg-surface"
          style={{ transformOrigin: "50% 0", willChange: "transform", pointerEvents: "auto", "--detail": 0 }}
        >
          <div
            className="relative shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <img
              src={img}
              alt=""
              draggable="false"
              className="aspect-[16/10] w-full object-cover object-top"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-white/80 shadow sm:hidden"
              style={{ opacity: "var(--detail)" }}
            />
          </div>

          <div
            className={`min-h-0 overscroll-contain px-6 pb-8 pt-5 sm:px-8 ${
              open ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            <h2 id="project-sheet-title" className="title-2">
              {title.trim()}
            </h2>
            <div style={{ opacity: "var(--detail)" }}>
              <p className="mt-3 text-secondary">{techStack}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={liveLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Visit site
                  <FiArrowUpRight aria-hidden />
                </a>
                {github && (
                  <a href={github} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    Source on GitHub
                    <FiArrowUpRight aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onRequestClose}
            aria-label="Close"
            className="pressable material absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-label"
            style={{ opacity: "var(--detail)" }}
          >
            <FiX size={18} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectSheet;
