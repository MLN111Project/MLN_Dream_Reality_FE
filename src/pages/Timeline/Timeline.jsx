import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Steps, Progress } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import TimelineDecisionPanel from '../../components/TimelineDecisionPanel';
import StatsMoodLayer from '../../components/StatsMoodLayer';
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

function countEventsBefore(stages, eventsMap, stageIdx, eventIdx) {
  let n = 0;
  for (let i = 0; i < stageIdx; i += 1) {
    n += eventsMap[stages[i].id]?.length || 0;
  }
  n += eventIdx;
  return n;
}

function countTotalEvents(stages, eventsMap) {
  return stages.reduce((sum, s) => sum + (eventsMap[s.id]?.length || 0), 0);
}

export default function Timeline() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    careerId,
    environmentId,
    stats,
    stageIndex,
    eventIndex,
    setStageIndex,
    setEventIndex,
    applyChoice,
  } = useSimulation();

  const timelineStages = useMemo(() => getTimelineStages(), []);
  const timelineEvents = useMemo(() => getTimelineEvents(), []);
  const career = useMemo(
    () => getCareers().find((c) => c.id === careerId),
    [careerId]
  );
  const environment = useMemo(
    () => getEnvironments().find((e) => e.id === environmentId),
    [environmentId]
  );

  const [selectedChoice, setSelectedChoice] = useState(null);

  const stage = timelineStages[stageIndex];
  const events = timelineEvents[stage?.id] || [];
  const currentEvent = eventIndex < events.length ? events[eventIndex] : null;
  const stress = getStressLevel(stats);
  const suppression = getSuppressionLevel(stats);

  const totalQuestions = useMemo(
    () => countTotalEvents(timelineStages, timelineEvents),
    [timelineStages, timelineEvents]
  );

  const completedQuestions = useMemo(
    () => countEventsBefore(timelineStages, timelineEvents, stageIndex, eventIndex),
    [timelineStages, timelineEvents, stageIndex, eventIndex]
  );

  const progressCurrent = currentEvent ? completedQuestions + 1 : completedQuestions;
  const journeyPercent =
    totalQuestions > 0 ? Math.round((progressCurrent / totalQuestions) * 100) : 0;

  const isLastQuestion =
    stageIndex === timelineStages.length - 1 &&
    eventIndex === events.length - 1 &&
    !!currentEvent;

  const panelMode =
    !currentEvent && eventIndex >= events.length && stageIndex < timelineStages.length - 1
      ? 'stageComplete'
      : 'question';

  useEffect(() => {
    if (!careerId || !environmentId) {
      navigate('/dream', { replace: true });
    }
  }, [careerId, environmentId, navigate]);

  useEffect(() => {
    setSelectedChoice(null);
  }, [stageIndex, eventIndex]);

  const advanceTimeline = () => {
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

  const handleConfirm = () => {
    if (!selectedChoice || !currentEvent) return;
    if (stats.mentalHealth < 40) playSound('stress');
    applyChoice(
      selectedChoice.effects,
      `${stage.title} — ${currentEvent.title}`,
      selectedChoice.flag
    );
    setSelectedChoice(null);
    advanceTimeline();
  };

  const handleNextStage = () => {
    playSound('click');
    setStageIndex(stageIndex + 1);
    setEventIndex(0);
  };

  if (!career || !environment || !stage) return null;

  return (
    <StatsMoodLayer stats={stats}>
      <PageTransition className="timeline-page page-container">
        <div className="timeline-page__frame glass-card">
          <header className="timeline-page__header">
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
          </header>

          <div className="timeline-page__main">
          <aside className="timeline-page__process glass-card">
            <div className="timeline-page__journey">
              <div className="timeline-page__journey-head">
                <span className="timeline-page__journey-label">
                  {t('timeline.journeyProgress')}
                </span>
                <span className="timeline-page__journey-count">
                  {t('timeline.questionProgress', {
                    current: Math.max(progressCurrent, 1),
                    total: totalQuestions,
                  })}
                </span>
              </div>
              <Progress
                percent={journeyPercent}
                showInfo={false}
                strokeColor={{ from: '#8b5cf6', to: '#06b6d4' }}
                trailColor="rgba(15, 23, 42, 0.1)"
                size="small"
              />
            </div>

            <Steps
              direction="vertical"
              current={stageIndex}
              className="timeline-steps timeline-steps--vertical"
              items={timelineStages.map((s) => ({
                title: s.title,
                description: s.subtitle,
              }))}
            />

            <motion.div
              className="timeline-page__stage"
              key={stage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="timeline-page__stage-label">
                {t('timeline.currentStage')}
              </span>
              <h2>{stage.title}</h2>
              <p>{stage.subtitle}</p>
              {events.length > 0 && (
                <p className="timeline-page__event-progress">
                  {t('timeline.eventProgress', {
                    current: Math.min(
                      currentEvent ? eventIndex + 1 : eventIndex,
                      events.length
                    ),
                    total: events.length,
                  })}
                </p>
              )}
            </motion.div>
          </aside>

          <div className="timeline-page__qa">
            {(currentEvent || panelMode === 'stageComplete') && (
              <TimelineDecisionPanel
                event={currentEvent}
                mode={panelMode}
                stats={stats}
                stress={stress}
                suppression={suppression}
                selectedChoice={selectedChoice}
                onSelectChoice={setSelectedChoice}
                onConfirm={handleConfirm}
                onNextStage={handleNextStage}
                isLastQuestion={isLastQuestion}
              />
            )}
          </div>
          </div>
        </div>
      </PageTransition>
    </StatsMoodLayer>
  );
}
