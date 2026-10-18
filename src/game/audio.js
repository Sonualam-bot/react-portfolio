import { Sound } from "littlejsengine";

// ZzFX recipes: [volume, randomness, frequency, attack, sustain, release, shape,
// shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime, noise,
// modulation, bitCrush, delay, sustainVolume, decay, tremolo]
export const sounds = {
  ping: new Sound([0.5, 0, 1320, 0.01, 0.04, 1.4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0.32, 0.6, 0.08]),
  blip: new Sound([0.25, 0, 990, 0, 0.02, 0.18, 0, 1.6, 0, 0, 0, 0, 0, 0, 0, 0, 0.1]),
  collect: new Sound([0.45, 0.02, 660, 0.01, 0.06, 0.25, 1, 1.8, 0, 0, 330, 0.06]),
  dock: new Sound([0.35, 0, 98, 0.08, 0.35, 0.5, 2, 0.6, 0, 0, 0, 0, 0, 0.05, 0, 0, 0, 0.7]),
  waypoint: new Sound([0.18, 0, 1800, 0, 0.01, 0.04, 0, 2]),
  bump: new Sound([0.3, 0.1, 70, 0, 0.04, 0.15, 3, 0.5, -4, 0, 0, 0, 0, 1.5]),
  fanfare: new Sound([0.4, 0, 523, 0.02, 0.2, 0.4, 1, 1.5, 0, 0, 262, 0.1, 0.13]),
};

let muted = false;
export const setMutedAudio = (value) => (muted = value);

export const play = (name, volume = 1, pitch = 1) => {
  if (!muted) sounds[name].play(undefined, volume, pitch);
};
