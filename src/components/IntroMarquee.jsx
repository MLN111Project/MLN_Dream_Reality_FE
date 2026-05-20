import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getIntroImages } from '../utils/introMedia';
import './IntroMarquee.css';

export default function IntroMarquee() {
  const { lang, t } = useLanguage();
  const images = useMemo(() => getIntroImages(lang), [lang]);
  const trackImages = useMemo(() => [...images, ...images], [images]);

  return (
    <motion.section
      className="intro-marquee"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.7 }}
      aria-label={t('landing.galleryLabel')}
    >
      <div className="intro-marquee__header">
        <span className="intro-marquee__label">{t('landing.galleryLabel')}</span>
        <div className="intro-marquee__line" />
      </div>

      <motion.div className="intro-marquee__viewport glass-card">
        <div className="intro-marquee__fade intro-marquee__fade--left" />
        <motion.div
          key={lang}
          className="intro-marquee__track"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {trackImages.map((src, i) => (
            <motion.div
              key={`${lang}-${i}`}
              className="intro-marquee__slide"
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img src={src} alt="" loading="lazy" draggable={false} />
            </motion.div>
          ))}
        </motion.div>
        <div className="intro-marquee__fade intro-marquee__fade--right" />
      </motion.div>
    </motion.section>
  );
}
