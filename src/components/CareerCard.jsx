import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './CareerCard.css';

export default function CareerCard({ career, selected, onSelect, index }) {
  const { t } = useLanguage();
  const Icon = career.icon;
  const isLocked = career.status === 'comingSoon';

  const handleClick = () => {
    if (isLocked) return;
    onSelect(career);
  };

  return (
    <motion.button
      type="button"
      className={`career-card glass-card ${selected ? 'career-card--selected' : ''} ${isLocked ? 'career-card--locked' : ''}${career.id === 'designer' ? ' career-card--designer' : ''}`}
      onClick={handleClick}
      disabled={isLocked}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={isLocked ? {} : { y: -8, scale: 1.02 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
      style={{ '--card-accent': career.color }}
    >
      {isLocked && (
        <span className="career-card__badge">{t('common.comingSoon')}</span>
      )}
      {career.image ? (
        <div className="career-card__image-wrap">
          <img src={career.image} alt={career.title} className="career-card__image" />
        </div>
      ) : (
        <motion.div
          className="career-card__icon-wrap"
          whileHover={isLocked ? {} : { rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon size={32} style={{ color: career.color }} />
        </motion.div>
      )}
      <h3
        className={`career-card__title${career.id === 'designer' ? ' career-card__title--compact' : ''}`}
      >
        {career.title}
      </h3>
      <p className="career-card__tagline">{career.tagline}</p>
      {selected && !isLocked && (
        <motion.span
          className="career-card__check"
          layoutId="career-check"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}
