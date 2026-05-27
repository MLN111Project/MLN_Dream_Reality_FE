import { motion } from 'framer-motion';
import bgMain from '../assets/background_mln111_g3.png';
import './AnimatedBackground.css';

export default function AnimatedBackground({ variant = 'default' }) {
  return (
    <motion.div
      className={`animated-bg animated-bg--${variant}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      aria-hidden
    >
      <div
        className="animated-bg__image"
        style={{ backgroundImage: `url(${bgMain})` }}
      />
      {(variant === 'warning' || variant === 'hope') && (
        <div className={`animated-bg__overlay animated-bg__overlay--${variant}`} />
      )}
      {variant === 'hope' && (
        <motion.div
          className="animated-bg__shine"
          animate={{ opacity: [0, 0.25, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
