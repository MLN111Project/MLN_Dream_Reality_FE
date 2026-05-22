import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { playSound } from '../utils/sounds';
import TimelineLiveStats from './TimelineLiveStats';
import './TimelineDecisionPanel.css';

export default function TimelineDecisionPanel({
  event,
  mode = 'question',
  stats,
  stress,
  suppression,
  selectedChoice,
  onSelectChoice,
  onConfirm,
  onNextStage,
  isLastQuestion,
}) {
  const { t } = useLanguage();

  return (
    <section className="timeline-panel glass-card" aria-live="polite">
      <AnimatePresence mode="wait">
        {mode === 'stageComplete' ? (
          <motion.div
            key="stage-complete"
            className="timeline-panel__body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <h2 className="timeline-panel__title">{t('timeline.stageComplete')}</h2>
            <p className="timeline-panel__narrative">{t('timeline.stageCompleteHint')}</p>

            <div className="timeline-panel__actions timeline-panel__actions--solo">
              <Button
                type="primary"
                size="large"
                className="timeline-panel__cta sim-btn-primary"
                icon={<ArrowRightOutlined />}
                iconPlacement="end"
                onClick={onNextStage}
              >
                {t('timeline.nextStage')}
              </Button>
            </div>

            <TimelineLiveStats stats={stats} stress={stress} suppression={suppression} />
          </motion.div>
        ) : event ? (
          <motion.div
            key={event.id}
            className="timeline-panel__body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="timeline-panel__title">{event.title}</h2>
            <p className="timeline-panel__narrative">{event.narrative}</p>

            <div className="timeline-panel__choices" role="listbox" aria-label={event.title}>
              {event.choices.map((choice, i) => {
                const isSelected = selectedChoice?.label === choice.label;
                return (
                  <motion.button
                    key={`${event.id}-${i}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`timeline-panel__choice ${isSelected ? 'timeline-panel__choice--selected' : ''}`}
                    onClick={() => {
                      playSound('click');
                      onSelectChoice(choice);
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="timeline-panel__choice-num">{i + 1}</span>
                    <span className="timeline-panel__choice-text">{choice.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="timeline-panel__actions">
              <p className="timeline-panel__hint">
                {!selectedChoice
                  ? t('timeline.selectAnswer')
                  : t('timeline.confirmHint')}
              </p>
              <Button
                type="primary"
                size="large"
                className="timeline-panel__cta sim-btn-primary"
                disabled={!selectedChoice}
                icon={<ArrowRightOutlined />}
                iconPlacement="end"
                onClick={onConfirm}
              >
                {isLastQuestion ? t('timeline.seeResults') : t('timeline.next')}
              </Button>
            </div>

            <TimelineLiveStats stats={stats} stress={stress} suppression={suppression} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
