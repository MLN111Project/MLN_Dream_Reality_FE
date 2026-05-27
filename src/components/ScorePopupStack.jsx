import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ScorePopupStack.css';

let popupSeq = 0;

export function useScorePopups() {
  const [items, setItems] = useState([]);

  const pushPopup = useCallback((popup) => {
    const id = `sp-${++popupSeq}`;
    setItems((prev) => [...prev, { id, ...popup }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }, 3200);
  }, []);

  return { items, pushPopup };
}

export default function ScorePopupStack({ items }) {
  return (
    <div className="score-popup-stack" aria-live="polite">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`score-popup score-popup--${item.variant || 'neutral'}`}
            initial={{ opacity: 0, x: 40, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.28 }}
          >
            {item.title && <span className="score-popup__title">{item.title}</span>}
            <span className="score-popup__delta">{item.delta}</span>
            {item.subtitle && <span className="score-popup__sub">{item.subtitle}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
