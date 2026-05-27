import { useEffect, useRef } from 'react';

export const BACKGROUND_MUSIC_SRC = '/sounds/nhac.mp3';

/**
 * Phát nhạc nền lặp (nhac.mp3). Bật/tắt qua prop `enabled`.
 * Hết bài → tự phát lại từ đầu (loop + sự kiện ended dự phòng).
 */
export function useBackgroundMusic(enabled, volume = 0.4) {
  const audioRef = useRef(null);
  const enabledRef = useRef(enabled);

  enabledRef.current = enabled;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (!audioRef.current) {
      const audio = new Audio(BACKGROUND_MUSIC_SRC);
      audio.loop = true;
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.volume = volume;

    const restartFromStart = () => {
      if (!enabledRef.current) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    const onEnded = () => restartFromStart();

    audio.addEventListener('ended', onEnded);

    if (enabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [enabled, volume]);

  useEffect(
    () => () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    },
    []
  );
}
