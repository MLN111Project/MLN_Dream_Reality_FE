import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Steps } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import DecisionModal from '../../components/DecisionModal';
import StatBar from '../../components/StatBar';
import LiveStatsChart from '../../components/LiveStatsChart';
import {
  getTimelineStages,
  getTimelineEvents,
  getCareers,
  getEnvironments,
} from '../../i18n/localizedData';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import { getStressLevel, getSuppressionLevel } from '../../utils/simulation';
import { playSound } from '../../utils/sounds';
import './Timeline.css';

const STAT_KEYS = ['passion', 'money', 'creativity', 'mentalHealth', 'socialRecognition'];

export default function Timeline() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const {
    careerId,
    environmentId,
    stats,
    history,
    stageIndex,
    eventIndex,
    setStageIndex,
    setEventIndex,
    applyChoice,
  } = useSimulation();

  const timelineStages = useMemo(() => getTimelineStages(lang), [lang]);
  const timelineEvents = useMemo(() => getTimelineEvents(lang), [lang]);
  const career = useMemo(
    () => getCareers(lang).find((c) => c.id === careerId),
    [lang, careerId]
  );
  const environment = useMemo(
    () => getEnvironments(lang).find((e) => e.id === environmentId),
    [lang, environmentId]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    if (!careerId || !environmentId) {
      navigate('/dream', { replace: true });
    }
  }, [careerId, environmentId, navigate]);

  const stage = timelineStages[stageIndex];
  const events = timelineEvents[stage?.id] || [];
  const stress = getStressLevel(stats);
  const suppression = getSuppressionLevel(stats);

  const openNextEvent = useCallback(() => {
    if (eventIndex < events.length) {
      setCurrentEvent(events[eventIndex]);
      setModalOpen(true);
      playSound('dramatic');
    }
  }, [eventIndex, events]);

  useEffect(() => {
    if (
      careerId &&
      environmentId &&
      events.length > 0 &&
      eventIndex < events.length &&
      !modalOpen
    ) {
      const timer = setTimeout(openNextEvent, 800);
      return () => clearTimeout(timer);
    }
  }, [
    stageIndex,
    eventIndex,
    careerId,
    environmentId,
    events.length,
    modalOpen,
    openNextEvent,
  ]);

  useEffect(() => {
    if (modalOpen && currentEvent && stage) {
      const updated = events.find((e) => e.id === currentEvent.id);
      if (updated) setCurrentEvent(updated);
    }
  }, [lang, modalOpen, currentEvent, events, stage]);

  const handleChoice = (choice) => {
    applyChoice(choice.effects, `${stage.title} — ${currentEvent?.title}`);
    setModalOpen(false);
    setCurrentEvent(null);

    const nextEventIndex = eventIndex + 1;
    if (nextEventIndex < events.length) {
      setEventIndex(nextEventIndex);
    } else if (stageIndex < timelineStages.length - 1) {
      setStageIndex(stageIndex + 1);
      setEventIndex(0);
    } else {
      playSound('dramatic');
      navigate('/ending');
    }
  };

  if (!career || !environment) return null;

  return (
    <PageTransition className="timeline-page page-container">
      <motion.div
        className="timeline-page__top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/environment')}
          className="back-btn"
        >
          {t('common.back')}
        </Button>
        <span className="step-indicator">{t('common.stepTimeline')}</span>
      </motion.div>

      <motion.div
        className="timeline-page__intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="timeline-page__title">
          {t('timeline.lifeAs')}{' '}
          <span className="gradient-text">{career.title}</span>
        </h1>
        <p className="timeline-page__env">
          {t('timeline.at')} {environment.title}
        </p>
      </motion.div>

      <Steps
        current={stageIndex}
        items={timelineStages.map((s) => ({
          title: s.title,
          description: s.subtitle,
        }))}
        className="timeline-steps"
      />

      <div className="timeline-page__layout">
        <motion.div
          className="timeline-page__stage glass-card"
          key={stage.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="timeline-page__stage-label">
                {t('timeline.currentStage')}
              </span>
              <h2>{stage.title}</h2>
              <p>{stage.subtitle}</p>
              {events.length > 0 && (
                <p className="timeline-page__event-progress">
                  {t('timeline.eventProgress', {
                    current: Math.min(eventIndex + 1, events.length),
                    total: events.length,
                  })}
                </p>
              )}
              {!modalOpen &&
                eventIndex >= events.length &&
                stageIndex < timelineStages.length - 1 && (
                  <Button
                    type="primary"
                    className="sim-btn-primary"
                    onClick={() => {
                      setStageIndex(stageIndex + 1);
                      setEventIndex(0);
                    }}
                  >
                    {t('timeline.nextStage')}
                  </Button>
                )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div className="timeline-page__stats">
          <motion.div
            className="timeline-page__indicators glass-card"
            animate={{
              boxShadow:
                stress > 60
                  ? '0 0 40px rgba(239, 68, 68, 0.3)'
                  : 'var(--shadow-glass)',
            }}
          >
            <h3>{t('timeline.liveStatus')}</h3>
            <motion.div
              className="timeline-indicator"
              animate={stress > 55 ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: stress > 55 ? Infinity : 0, duration: 2 }}
            >
              <span className="stat-label">{t('timeline.systemStress')}</span>
              <motion.div className="timeline-indicator__bar timeline-indicator__bar--stress">
                <motion.div
                  className="timeline-indicator__fill"
                  animate={{ width: `${stress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
              <span className="timeline-indicator__val" style={{ color: '#ef4444' }}>
                {Math.round(stress)}%
              </span>
            </motion.div>
            <motion.div className="timeline-indicator">
              <span className="stat-label">{t('timeline.creativeSuppression')}</span>
              <motion.div className="timeline-indicator__bar timeline-indicator__bar--suppress">
                <motion.div
                  className="timeline-indicator__fill"
                  animate={{ width: `${suppression}%` }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
              <span className="timeline-indicator__val" style={{ color: '#f97316' }}>
                {Math.round(suppression)}%
              </span>
            </motion.div>
          </motion.div>

          <motion.div className="timeline-page__bars glass-card">
            <h3>{t('timeline.yourStats')}</h3>
            {STAT_KEYS.map((key, i) => (
              <StatBar
                key={key}
                statKey={key}
                value={stats[key]}
                delay={i * 0.08}
                showWarning
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <LiveStatsChart history={history} />

      <DecisionModal
        open={modalOpen}
        event={currentEvent}
        onChoice={handleChoice}
        onClose={() => setModalOpen(false)}
      />
    </PageTransition>
  );
}
