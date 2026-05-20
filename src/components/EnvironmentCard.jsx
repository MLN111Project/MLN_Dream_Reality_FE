import { motion } from 'framer-motion';
import { Progress } from 'antd';
import { useLanguage } from '../context/LanguageContext';
import { getEnvModifierLabels } from '../i18n/localizedData';
import './EnvironmentCard.css';

const MOD_KEYS = [
  { key: 'salary', modKey: 'salary' },
  { key: 'creativity', modKey: 'creativity' },
  { key: 'freedom', modKey: 'freedom' },
  { key: 'mentalHealth', modKey: 'mentalHealth' },
  { key: 'recognition', modKey: 'recognition' },
];

export default function EnvironmentCard({ env, selected, onSelect, index }) {
  const { lang } = useLanguage();
  const modifierLabels = getEnvModifierLabels(lang);
  const Icon = env.icon;

  return (
    <motion.button
      type="button"
      className={`env-card glass-card ${selected ? 'env-card--selected' : ''}`}
      onClick={() => onSelect(env)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      style={{ '--env-color': env.color }}
    >
      <motion.div className="env-card__header">
        <Icon size={28} style={{ color: env.color }} />
        <h3>{env.title}</h3>
      </motion.div>
      <p className="env-card__desc">{env.description}</p>
      <motion.div className="env-card__stats">
        {MOD_KEYS.map(({ key, modKey }) => (
          <motion.div key={key} className="env-card__stat">
            <span className="stat-label">{modifierLabels[modKey]}</span>
            <Progress
              percent={env.modifiers[key]}
              showInfo={false}
              strokeColor={env.color}
              trailColor="rgba(255,255,255,0.06)"
              size="small"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.button>
  );
}
