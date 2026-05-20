import { Modal } from 'antd';
import { motion } from 'framer-motion';
import { playSound } from '../utils/sounds';
import './DecisionModal.css';

export default function DecisionModal({
  open,
  event,
  onChoice,
  onClose,
}) {
  if (!event) return null;

  const handleChoice = (choice) => {
    playSound('click');
    onChoice(choice);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={560}
      className="decision-modal"
      destroyOnHidden
      maskStyle={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.75)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.span
          className="decision-modal__badge"
          initial={{ width: 0 }}
          animate={{ width: 60 }}
        />
        <h2 className="decision-modal__title">{event.title}</h2>
        <p className="decision-modal__narrative">{event.narrative}</p>
        <motion.div
          className="decision-modal__choices"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {event.choices.map((choice, i) => (
            <motion.button
              key={choice.label}
              type="button"
              className="decision-modal__choice glass-card"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(139, 92, 246, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice(choice)}
            >
              <span className="decision-modal__choice-num">{i + 1}</span>
              {choice.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </Modal>
  );
}
