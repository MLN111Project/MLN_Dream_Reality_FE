import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './SocialStats.css';

const SOCIAL_KEYS = [
  { key: 'itBurnout', value: '72%', color: '#ef4444' },
  { key: 'teacherSalary', value: '58%', color: '#f97316' },
  { key: 'designerOT', value: '64%', color: '#8b5cf6' },
  { key: 'creatorDepression', value: '41%', color: '#06b6d4' },
];

export default function SocialStats() {
  const { t } = useLanguage();

  return (
    <motion.section
      className="social-stats glass-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3>{t('ending.socialTitle')}</h3>
      <p className="social-stats__subtitle">{t('ending.socialSubtitle')}</p>
      <div className="social-stats__grid">
        {SOCIAL_KEYS.map((item, i) => (
          <motion.div
            key={item.key}
            className="social-stats__item"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="social-stats__value" style={{ color: item.color }}>
              {item.value}
            </span>
            <span className="social-stats__label">{t(`ending.social.${item.key}`)}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
