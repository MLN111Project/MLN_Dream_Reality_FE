import { motion } from 'framer-motion';
import './CareerCard.css';

export default function CareerCard({ career, selected, onSelect, index }) {
  const Icon = career.icon;

  return (
    <motion.button
      type="button"
      className={`career-card glass-card ${selected ? 'career-card--selected' : ''}`}
      onClick={() => onSelect(career)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ '--card-accent': career.color }}
    >
      <motion.div
        className="career-card__icon-wrap"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Icon size={32} style={{ color: career.color }} />
      </motion.div>
      <h3 className="career-card__title">{career.title}</h3>
      <p className="career-card__tagline">{career.tagline}</p>
      {selected && (
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
