import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircleOutlined,
  SoundOutlined,
  AudioMutedOutlined,
} from '@ant-design/icons';
import { useLanguage } from '../context/LanguageContext';
import { getIntroVideo, getIntroImages } from '../utils/introMedia';
import { playSound } from '../utils/sounds';
import './IntroVideo.css';

export default function IntroVideo() {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const videoSrc = getIntroVideo();
  const poster = getIntroImages()[0];
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    setMuted(true);
    el.load();
    el.play().catch(() => {});
  }, [videoSrc]);

  const toggleSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;

    playSound('click');
    const nextMuted = !el.muted;
    el.muted = nextMuted;
    if (!nextMuted) {
      el.volume = 1;
      el.play().catch(() => {});
    }
    setMuted(nextMuted);
  }, []);

  return (
    <motion.section
      className="intro-video"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95, duration: 0.8 }}
    >
      <motion.div className="intro-video__header">
        <PlayCircleOutlined className="intro-video__icon" />
        <span>{t('landing.videoLabel')}</span>
      </motion.div>

      <motion.div className="intro-video__frame glass-card">
        <AnimatePresence mode="wait">
          <motion.div
            key="intro-video"
            className="intro-video__inner"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
          >
            <video
              ref={videoRef}
              className="intro-video__player"
              src={videoSrc}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="intro-video__overlay" />
            <motion.button
              type="button"
              className={`intro-video__sound-btn ${muted ? 'intro-video__sound-btn--muted' : 'intro-video__sound-btn--on'}`}
              onClick={toggleSound}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              aria-label={muted ? t('landing.videoMuted') : t('landing.videoSoundOn')}
              title={muted ? t('landing.videoMuted') : t('landing.videoSoundOff')}
            >
              {muted ? <AudioMutedOutlined /> : <SoundOutlined />}
              <span>{muted ? t('landing.videoMuted') : t('landing.videoSoundOn')}</span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
