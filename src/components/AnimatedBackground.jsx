import { motion } from 'framer-motion';
import './AnimatedBackground.css';

export default function AnimatedBackground({ variant = 'default' }) {
  const isWarning = variant === 'warning';
  const isHope = variant === 'hope';

  return (
    <motion.div
      className={`animated-bg animated-bg--${variant}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="animated-bg__orb animated-bg__orb--1" />
      <motion.div
        className="animated-bg__orb animated-bg__orb--2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: isWarning ? [0.3, 0.5, 0.3] : [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="animated-bg__grid" />
      {isHope && <motion.div className="animated-bg__shine" animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 4, repeat: Infinity }} />}
    </motion.div>
  );
}
