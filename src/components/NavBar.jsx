import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion, useSpring } from "../lib/spring";

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function useActiveSection() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const visible = new Set();
    // A thin band across the middle of the viewport decides "where am I".
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.isIntersecting
            ? visible.add(entry.target.id)
            : visible.delete(entry.target.id)
        );
        const current = sections.find(({ id }) => visible.has(id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

function MobileMenu({ open, active, onClose, buttonRef }) {
  const panelRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  const render = useCallback((p) => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.opacity = p;
    // Grows out of the menu button (transform-origin: top right).
    panel.style.transform = prefersReducedMotion()
      ? "none"
      : `translateY(${(1 - p) * -6}px) scale(${0.94 + 0.06 * p})`;
    panel.style.visibility = p < 0.001 && !openRef.current ? "hidden" : "visible";
  }, []);

  const progress = useSpring(0, { response: 0.3, precision: 0.001 });
  progress.onUpdate = render;

  useEffect(() => {
    render(progress.value);
  }, [progress, render]);

  useEffect(() => {
    const panel = panelRef.current;
    if (open) panel.removeAttribute("inert");
    else panel.setAttribute("inert", "");
    progress.to(open ? 1 : 0, { response: prefersReducedMotion() ? 0.2 : 0.3 });
  }, [open, progress]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (
        !panelRef.current?.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
      ) {
        onClose();
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, buttonRef]);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className="absolute right-3 top-[calc(100%+0.25rem)] w-56 origin-top-right rounded-2xl bg-surface p-1.5 shadow-popover md:hidden"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <ul>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={onClose}
              aria-current={active === id ? "true" : undefined}
              className="pressable flex items-center justify-between rounded-xl px-3.5 py-3 active:bg-label/[0.08]"
            >
              {label}
              {active === id && (
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavBar() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const linkRefs = useRef({});
  const pillRef = useRef(null);
  const menuButtonRef = useRef(null);

  // X and width get independent springs so they never desync.
  const pillX = useSpring(0, { response: 0.35, precision: 0.1 });
  const pillW = useSpring(0, { response: 0.35, precision: 0.1 });
  const pillO = useSpring(0, { response: 0.25, precision: 0.001 });

  const renderPill = useCallback(() => {
    const pill = pillRef.current;
    if (!pill) return;
    pill.style.transform = `translateX(${pillX.value}px)`;
    pill.style.width = `${pillW.value}px`;
    pill.style.opacity = pillO.value;
  }, [pillX, pillW, pillO]);
  pillX.onUpdate = renderPill;
  pillW.onUpdate = renderPill;
  pillO.onUpdate = renderPill;

  const movePill = useCallback(
    (animate) => {
      const el = active && linkRefs.current[active];
      if (!el) {
        pillO.to(0);
        return;
      }
      const x = el.offsetLeft;
      const w = el.offsetWidth;
      if (!animate || pillO.value < 0.01 || prefersReducedMotion()) {
        pillX.set(x);
        pillW.set(w);
      } else {
        pillX.to(x);
        pillW.to(w);
      }
      pillO.to(1);
    },
    [active, pillX, pillW, pillO]
  );

  useLayoutEffect(() => movePill(true), [movePill]);

  useEffect(() => {
    const onResize = () => movePill(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [movePill]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Material only appears once content scrolls underneath it. */}
      <div
        aria-hidden
        className={`material scroll-edge absolute inset-0 transition-opacity duration-300 ${
          scrolled || menuOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav
        aria-label="Primary"
        className="container-page relative flex h-14 items-center justify-between"
      >
        <a
          href="#top"
          className="pressable -ml-2 rounded-full px-2 py-1.5 text-[0.9375rem] font-semibold tracking-[-0.01em]"
        >
          Md Sonu Alam
        </a>

        <div className="relative hidden md:block">
          <span
            ref={pillRef}
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-full bg-label/[0.07]"
            style={{ opacity: 0, width: 0 }}
          />
          <ul className="relative flex items-center">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  ref={(el) => {
                    linkRefs.current[id] = el;
                  }}
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className="pressable block rounded-full px-3.5 py-1.5 text-sm text-secondary hover:text-label aria-[current]:text-label"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="pressable -mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
        >
          <span className="relative block h-3 w-[1.125rem]" aria-hidden>
            <span
              className={`absolute left-0 h-[1.5px] w-full rounded-full bg-label transition-[top,transform] duration-200 ${
                menuOpen ? "top-[5px] rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 h-[1.5px] w-full rounded-full bg-label transition-[top,transform] duration-200 ${
                menuOpen ? "top-[5px] -rotate-45" : "top-2"
              }`}
            />
          </span>
        </button>
      </nav>

      <MobileMenu
        open={menuOpen}
        active={active}
        onClose={closeMenu}
        buttonRef={menuButtonRef}
      />
    </header>
  );
}

export default NavBar;
