import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import StatBar from './StatBar';
import './TimelineLiveStats.css';

const STAT_KEYS = ['passion', 'money', 'creativity', 'mentalHealth', 'socialRecognition'];

export default function TimelineLiveStats({ stats, stress, suppression }) {
  const { t } = useLanguage();

  return (
    <div className="timeline-live-stats">
      <motion.div
        className="timeline-live-stats__card glass-card"
        animate={{
          boxShadow:
            stress > 60
              ? '0 0 40px rgba(239, 68, 68, 0.3)'
              : 'var(--shadow-glass)',
        }}
      >
        <h3>{t('timeline.liveStatus')}</h3>
        <motion.div
          className="timeline-indicator"
          animate={stress > 55 ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: stress > 55 ? Infinity : 0, duration: 2 }}
        >
          <span className="stat-label">{t('timeline.systemStress')}</span>
          <motion.div className="timeline-indicator__bar timeline-indicator__bar--stress">
            <motion.div
              className="timeline-indicator__fill"
              animate={{ width: `${stress}%` }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
          <span className="timeline-indicator__val" style={{ color: '#ef4444' }}>
            {Math.round(stress)}%
          </span>
        </motion.div>
        <motion.div className="timeline-indicator">
          <span className="stat-label">{t('timeline.creativeSuppression')}</span>
          <motion.div className="timeline-indicator__bar timeline-indicator__bar--suppress">
            <motion.div
              className="timeline-indicator__fill"
              animate={{ width: `${suppression}%` }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
          <span className="timeline-indicator__val" style={{ color: '#f97316' }}>
            {Math.round(suppression)}%
          </span>
        </motion.div>
      </motion.div>

      <div className="timeline-live-stats__card glass-card">
        <h3>{t('timeline.yourStats')}</h3>
        {STAT_KEYS.map((key, i) => (
          <StatBar
            key={key}
            statKey={key}
            value={stats[key]}
            delay={i * 0.05}
            showWarning
          />
        ))}
      </div>
    </div>
  );
}
