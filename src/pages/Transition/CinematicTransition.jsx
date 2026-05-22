import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulation } from '../../context/SimulationContext';
import { playSound, playHeartbeat } from '../../utils/sounds';
import './CinematicTransition.css';

const LINES = ['line1', 'line2', 'line3'];

export default function CinematicTransition() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { careerId } = useSimulation();
  const [phase, setPhase] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!careerId) {
      navigate('/dream', { replace: true });
    }
  }, [careerId, navigate]);

  useEffect(() => {
    playHeartbeat(5);
    const timers = LINES.map((_, i) =>
      setTimeout(() => setPhase(i + 1), 1200 + i * 2200)
    );
    const btnTimer = setTimeout(
      () => setShowButton(true),
      1200 + LINES.length * 2200 + 800
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(btnTimer);
    };
  }, []);

  const handleContinue = () => {
    playSound('dramatic');
    navigate('/environment');
  };

  return (
    <motion.div
      className="cinematic-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="cinematic-transition__vignette" />
      <div className="cinematic-transition__pulse" />

      <motion.div className="cinematic-transition__content">
        <AnimatePresence>
          {LINES.map(
            (key, i) =>
              phase > i && (
                <motion.p
                  key={key}
                  className="cinematic-transition__line"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  {t(`transition.${key}`)}
                </motion.p>
              )
          )}
        </AnimatePresence>

        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="primary"
              size="large"
              className="sim-btn-primary"
              onClick={handleContinue}
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
            >
              {t('transition.continue')}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
