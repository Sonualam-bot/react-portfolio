import { useEffect, useRef } from "react";

const reducedMotionQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

export const prefersReducedMotion = () => Boolean(reducedMotionQuery?.matches);

/**
 * An interruptible spring described the way Apple describes them:
 * - dampingRatio: 1 = critically damped (no overshoot), < 1 = bouncy.
 * - response: roughly how long (seconds) it takes to reach the target.
 *
 * Calling `to()` mid-flight re-targets from the current value *and* keeps the
 * current velocity, so reversals never hit a "brick wall".
 */
export class Spring {
  constructor(
    value = 0,
    { dampingRatio = 1, response = 0.4, precision = 0.01, onUpdate, onRest } = {}
  ) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.dampingRatio = dampingRatio;
    this.response = response;
    this.precision = precision;
    this.onUpdate = onUpdate;
    this.onRest = onRest;
    this.frame = null;
    this.lastTime = null;
  }

  get isAnimating() {
    return this.frame !== null;
  }

  /** Jump to a value with no animation (e.g. while tracking a finger 1:1). */
  set(value) {
    this.stop();
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.onUpdate?.(value);
  }

  to(target, { velocity, dampingRatio, response } = {}) {
    this.target = target;
    if (velocity !== undefined) this.velocity = velocity;
    if (dampingRatio !== undefined) this.dampingRatio = dampingRatio;
    if (response !== undefined) this.response = response;
    if (this.frame === null) {
      this.lastTime = null;
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  stop() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  tick = (now) => {
    // Clamp long frames (background tabs) so the simulation never explodes.
    const dt =
      this.lastTime === null ? 1 / 60 : Math.min((now - this.lastTime) / 1000, 1 / 30);
    this.lastTime = now;

    const stiffness = ((2 * Math.PI) / this.response) ** 2;
    const damping = (4 * Math.PI * this.dampingRatio) / this.response;
    const steps = Math.max(1, Math.ceil(dt * 240));
    const h = dt / steps;

    for (let i = 0; i < steps; i += 1) {
      const acceleration =
        -stiffness * (this.value - this.target) - damping * this.velocity;
      this.velocity += acceleration * h;
      this.value += this.velocity * h;
    }

    const settled =
      Math.abs(this.value - this.target) < this.precision &&
      Math.abs(this.velocity) < this.precision * 10;

    if (settled) {
      this.value = this.target;
      this.velocity = 0;
      this.frame = null;
      this.onUpdate?.(this.value);
      this.onRest?.(this.value);
      return;
    }

    this.onUpdate?.(this.value);
    this.frame = requestAnimationFrame(this.tick);
  };
}

/** A Spring that lives for the lifetime of the component. */
export function useSpring(initial, options) {
  const ref = useRef(null);
  if (ref.current === null) ref.current = new Spring(initial, options);
  useEffect(() => {
    const spring = ref.current;
    return () => spring.stop();
  }, []);
  return ref.current;
}

/**
 * Where a flick would come to rest, using the same exponential deceleration
 * as scroll views. decelerationRate 0.998 = normal, 0.99 = fast.
 */
export function project(velocity, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary instead of a hard stop. */
export function rubberband(overshoot, dimension, constant = 0.55) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

/** Keeps a short history of pointer positions to measure release velocity. */
export function createVelocityTracker(windowMs = 100) {
  let samples = [];
  return {
    reset() {
      samples = [];
    },
    add(value, time = performance.now()) {
      samples.push({ value, time });
      samples = samples.filter((s) => time - s.time <= windowMs);
    },
    /** px/s; 0 if the pointer paused before release. */
    velocity(now = performance.now()) {
      const recent = samples.filter((s) => now - s.time <= windowMs);
      if (recent.length < 2) return 0;
      const first = recent[0];
      const last = recent[recent.length - 1];
      const seconds = (last.time - first.time) / 1000;
      return seconds > 0 ? (last.value - first.value) / seconds : 0;
    },
  };
}

export const lerp = (from, to, t) => from + (to - from) * t;
export const clamp01 = (t) => Math.min(1, Math.max(0, t));
