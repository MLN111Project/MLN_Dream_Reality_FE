import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './LoadingScreen.css';

export default function LoadingScreen({ onFinish }) {
  const { setLoading } = useSimulation();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onFinish?.();
    }, 2800);
    return () => clearTimeout(timer);
  }, [setLoading, onFinish]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <LanguageSwitcher />
      <div className="loading-bg-gradient" />
      <motion.div
        className="loading-logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span className="gradient-text">{t('loading.dream')}</span>
        <span className="loading-vs">{t('loading.vs')}</span>
        <span className="loading-reality">{t('loading.reality')}</span>
      </motion.div>
      <motion.p
        className="loading-tagline"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {t('loading.tagline')}
      </motion.p>
      <motion.div className="loading-bar-wrap">
        <motion.div
          className="loading-bar"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
