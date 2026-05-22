import { motion } from 'framer-motion';
import { CheckOutlined } from '@ant-design/icons';
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
      className={`env-card env-card--premium ${selected ? 'env-card--selected' : ''}`}
      onClick={() => onSelect(env)}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: selected ? 1.02 : 1,
      }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.985 }}
      style={{ '--env-color': env.color }}
      aria-pressed={selected}
    >
      <span className="env-card__glow" aria-hidden />
      <span className="env-card__accent" aria-hidden />

      {selected && (
        <motion.span
          className="env-card__check"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          aria-hidden
        >
          <CheckOutlined />
        </motion.span>
      )}

      <div className="env-card__icon-wrap">
        <Icon size={22} aria-hidden />
      </div>

      <h3 className="env-card__title">{env.title}</h3>
      <p className="env-card__desc">{env.description}</p>

      <div className="env-card__stats">
        {MOD_KEYS.map(({ key, modKey }) => {
          const value = env.modifiers[key];
          return (
            <div key={key} className="env-card__stat">
              <div className="env-card__stat-head">
                <span className="env-card__stat-label">{modifierLabels[modKey]}</span>
                <span className="env-card__stat-value">{value}</span>
              </div>
              <div className="env-card__meter" role="presentation">
                <motion.span
                  className="env-card__meter-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ delay: 0.15 + index * 0.05, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.button>
  );
}
