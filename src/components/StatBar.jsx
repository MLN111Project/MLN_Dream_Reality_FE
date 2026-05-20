import { motion } from 'framer-motion';
import { Progress } from 'antd';
import { useLanguage } from '../context/LanguageContext';
import './StatBar.css';

const STAT_COLORS = {
  passion: '#ec4899',
  money: '#10b981',
  creativity: '#8b5cf6',
  mentalHealth: '#06b6d4',
  socialRecognition: '#3b82f6',
};

export default function StatBar({ statKey, value, delay = 0, showWarning }) {
  const { t } = useLanguage();
  const color = STAT_COLORS[statKey] || '#8b5cf6';
  const isLow = value < 35;
  const isCritical = value < 20;

  return (
    <motion.div
      className={`stat-bar ${showWarning && isLow ? 'stat-bar--warning' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div
        className="stat-bar__header"
        animate={isCritical ? { x: [0, -2, 2, 0] } : {}}
        transition={{ repeat: isCritical ? Infinity : 0, duration: 0.5 }}
      >
        <span className="stat-label">{t(`stats.${statKey}`)}</span>
        <span className="stat-bar__value" style={{ color }}>
          {Math.round(value)}
        </span>
      </motion.div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={isLow && showWarning ? 'var(--warning-gradient)' : color}
        trailColor="rgba(255,255,255,0.06)"
        strokeWidth={8}
        className="stat-bar__progress"
      />
    </motion.div>
  );
}
