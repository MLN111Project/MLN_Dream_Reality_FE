/** Placeholder sound hooks — wire to real audio files when available */

export const SOUNDS = {
  click: '/sounds/click.mp3',
  ambient: '/sounds/ambient.mp3',
  dramatic: '/sounds/dramatic.mp3',
  success: '/sounds/success.mp3',
  warning: '/sounds/warning.mp3',
};

export function playSound(_key) {
  // Placeholder: integrate Audio API when assets are added
  // const audio = new Audio(SOUNDS[key]);
  // audio.volume = 0.3;
  // audio.play().catch(() => {});
}
