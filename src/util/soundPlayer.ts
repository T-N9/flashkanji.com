type SoundKey =
  | "right"
  | "wrong"
  | "session"
  | "alert"
  | "click"
  | "flip"
  | "loss";

const soundFiles: Record<SoundKey, string> = {
  right: "/assets/sounds/right.mp3",
  wrong: "/assets/sounds/wrong.mp3",
  session: "/assets/sounds/session.mp3",
  alert: "/assets/sounds/alert.mp3",
  click: "/assets/sounds/click.mp3",
  flip: "/assets/sounds/flip.mp3",
  loss: "/assets/sounds/loss.mp3",
};

const audioCache = new Map<SoundKey, HTMLAudioElement>();

export function playSound(key: SoundKey) {
  if (!soundFiles[key]) {
    console.warn(`Sound "${key}" does not exist.`);
    return;
  }

  let audio = audioCache.get(key);

  if (!audio) {
    audio = new Audio(soundFiles[key]);
    audio.volume = 0.5;
    audioCache.set(key, audio);
  }

  // Reset and play
  audio.currentTime = 0;
  audio.play().catch((err) => {
    console.error(`Failed to play sound "${key}":`, err);
  });
}
