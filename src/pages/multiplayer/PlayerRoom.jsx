import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Progress, Tag } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import TeamEndingPanel from '../../components/TeamEndingPanel';
import ScorePopupStack, { useScorePopups } from '../../components/ScorePopupStack';
import { getSocket, emitAsync } from '../../services/socket';
import { useLanguage } from '../../context/LanguageContext';
import { getEnvironments } from '../../i18n/localizedData';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';
import './Multiplayer.css';

const CHOICE_COLORS = ['#2563eb', '#ea580c', '#7c3aed'];

const EVENT_TAG_COLORS = {
  bonus_points: 'green',
  penalty_points: 'red',
  steal_points: 'purple',
  swap_points: 'blue',
  neutral: 'default',
};

function eventRequiresTarget(eventId) {
  return eventId === 'steal_points' || eventId === 'swap_points';
}

function popupFromFeedback(t, fb) {
  if (!fb) return null;
  const delta = fb.pointsDelta ?? 0;
  const d = fb.details || {};
  const eventId = fb.eventId || 'neutral';
  const title =
    fb.messageKey === 'event_skipped'
      ? t('play.skipEvent')
      : t(`play.eventTypes.${eventId}`);
  let variant = delta > 0 ? 'gain' : delta < 0 ? 'loss' : 'neutral';
  let subtitle = '';

  if (eventId === 'steal_points' && d.stolenFrom) {
    variant = 'steal';
    subtitle = t('play.popupStealFrom', { amount: d.stolen, name: d.stolenFrom });
  } else if (eventId === 'swap_points' && d.swappedWith) {
    variant = 'swap';
    subtitle = t('play.popupSwap', { name: d.swappedWith });
  }

  const deltaText = delta > 0 ? `+${delta}` : `${delta}`;
  return { title, delta: deltaText, subtitle, variant };
}

export default function PlayerRoom() {
  const { code: routeCode } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const environments = useMemo(() => getEnvironments(), []);
  const [state, setState] = useState(null);
  const [teamId] = useState(() => sessionStorage.getItem('teamId'));
  const [feedback, setFeedback] = useState('');
  const [tick, setTick] = useState(0);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [targetTeamId, setTargetTeamId] = useState(null);
  const [skipEvent, setSkipEvent] = useState(false);
  const { items: popupItems, pushPopup } = useScorePopups();
  const lastPopupKey = useRef('');

  const roomCode =
    state?.code || routeCode?.toUpperCase() || sessionStorage.getItem('roomCode') || '';

  useEffect(() => {
    const socket = getSocket();
    const onUpdate = (payload) => setState(payload.player);

    const sync = async () => {
      const storedCode = sessionStorage.getItem('roomCode') || routeCode;
      if (!storedCode || !teamId) {
        navigate('/play/join', { replace: true });
        return;
      }
      const res = await emitAsync('player:sync', {
        code: storedCode,
        teamId,
      });
      if (res?.ok) {
        setState(res.state);
        sessionStorage.setItem('roomCode', res.state.code);
      } else {
        navigate('/play/join', { replace: true });
      }
    };

    sync();
    socket.on('room:update', onUpdate);
    return () => socket.off('room:update', onUpdate);
  }, [routeCode, teamId, navigate]);

  useEffect(() => {
    if (state?.phase !== 'question' || !state?.questionEndsAt) return undefined;
    const id = window.setInterval(() => setTick((n) => n + 1), 500);
    return () => window.clearInterval(id);
  }, [state?.phase, state?.questionEndsAt, state?.questionIndex]);

  const formatEventFeedback = useCallback(
    (res) => {
      if (!res?.messageKey) return '';
      const key = `play.events.${res.messageKey}`;
      const text = t(key, { ...(res.details || {}), pointsDelta: res.pointsDelta });
      return text === key ? '' : text;
    },
    [t]
  );

  const showFeedbackPopup = useCallback(
    (fb) => {
      const popup = popupFromFeedback(t, fb);
      if (!popup) return;
      const key = `${state?.questionIndex}-${fb.messageKey}-${fb.pointsDelta}`;
      if (lastPopupKey.current === key) return;
      lastPopupKey.current = key;
      pushPopup(popup);
    },
    [t, pushPopup, state?.questionIndex]
  );

  useEffect(() => {
    const fb = state?.myTeam?.lastFeedback;
    if (!fb || state?.phase !== 'question') return;
    showFeedbackPopup(fb);
    setFeedback(formatEventFeedback(fb) || t('play.choiceRecorded'));
  }, [state?.myTeam?.lastFeedback, state?.phase, state?.questionIndex, formatEventFeedback, showFeedbackPopup, t]);

  useEffect(() => {
    lastPopupKey.current = '';
    setFeedback('');
    setPickedIndex(null);
    setTargetTeamId(null);
    setSkipEvent(false);
  }, [state?.questionIndex]);

  const musicOn = Boolean(state?.musicOn);
  useBackgroundMusic(musicOn);

  useEffect(() => {
    if (!state || state.phase !== 'question' || skipEvent) return;
    const meTeam = state.myTeam || state.teams?.find((t) => t.id === teamId);
    const ev = meTeam?.activeEvent;
    const others = (state.teams || []).filter((t) => t.id !== teamId);
    if (!eventRequiresTarget(ev) || others.length !== 1) return;
    setTargetTeamId((prev) => prev || others[0].id);
  }, [state?.questionIndex, state?.phase, state?.myTeam?.activeEvent, state?.teams, teamId, skipEvent]);

  if (!state) {
    return (
      <PageTransition className="multi-page page-container">
        <div className="multi-panel glass-card multi-connecting">
          <p>{t('play.connecting')}</p>
          {roomCode && (
            <p className="multi-room-badge__code multi-room-badge__code--inline">{roomCode}</p>
          )}
        </div>
      </PageTransition>
    );
  }

  const me = state.myTeam || state.teams?.find((t) => t.id === teamId);
  const chosenIndex =
    me?.lastChoiceIndex != null ? me.lastChoiceIndex : pickedIndex;
  const myEnv = environments.find((e) => e.id === me?.environmentId);
  const q = state.question;
  const maxTeams = state.maxTeams || 8;
  const timeLeft = state.questionEndsAt
    ? Math.max(0, Math.ceil((state.questionEndsAt - Date.now()) / 1000))
    : 0;
  const myEvent = me?.activeEvent;
  const myEventAmount = me?.eventAmount;
  const otherTeams = (state.teams || []).filter((t) => t.id !== teamId);
  const canSkipEvent = myEvent && myEvent !== 'neutral';
  const needsTarget =
    !skipEvent && eventRequiresTarget(myEvent) && otherTeams.length > 0;
  const canAnswer = skipEvent || !needsTarget || Boolean(targetTeamId);
  const selectedTarget = otherTeams.find((t) => t.id === targetTeamId);

  const handleAnswer = async (index) => {
    if (me?.answered || state.phase !== 'question') return;
    if (needsTarget && !targetTeamId) {
      setFeedback(t('play.pickTargetFirst'));
      return;
    }
    const res = await emitAsync('player:answer', {
      choiceIndex: index,
      targetTeamId: needsTarget ? targetTeamId : undefined,
      skipEvent: skipEvent && canSkipEvent,
    });
    if (res?.error === 'TARGET_REQUIRED') {
      setFeedback(t('play.pickTargetFirst'));
      return;
    }
    if (res?.ok) {
      setPickedIndex(index);
      const fb = {
        messageKey: res.messageKey,
        pointsDelta: res.pointsDelta,
        eventId: res.eventId,
        details: res.details,
      };
      showFeedbackPopup(fb);
      setFeedback(formatEventFeedback(res) || t('play.choiceRecorded'));
    }
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('teamId');
    sessionStorage.removeItem('roomCode');
    navigate('/');
  };

  if (state.phase === 'ended' && me?.endingId) {
    return (
      <PageTransition className="multi-page multi-page--ending page-container">
        <ScorePopupStack items={popupItems} />
        <div className="multi-room-badge glass-card">
          <span className="multi-room-badge__label">{t('play.currentRoom')}</span>
          <span className="multi-room-badge__code">{state.code}</span>
        </div>
        <div className="multi-final-score glass-card">
          <span className="multi-final-score__label">{t('play.finalScore')}</span>
          <span className="multi-final-score__value">
            {me.score ?? 0}
            <span className="multi-final-score__unit">{t('play.points')}</span>
          </span>
        </div>
        <TeamEndingPanel
          teamName={me.name}
          careerId={state.careerId}
          environmentId={me.environmentId}
          stats={me.stats}
          history={me.history}
          endingId={me.endingId}
          aiAnalysis={me.aiAnalysis}
          aiAnalysisStatus={me.aiAnalysisStatus}
          onHome={handleGoHome}
        />
      </PageTransition>
    );
  }

  if (state.phase === 'lobby') {
    return (
      <PageTransition className="multi-page page-container">
        <div className="multi-room-badge glass-card">
          <span className="multi-room-badge__label">{t('play.currentRoom')}</span>
          <span className="multi-room-badge__code">{state.code}</span>
        </div>

        <div className="multi-panel glass-card multi-lobby-wait">
          <motion.div
            className="multi-lobby-wait__pulse"
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2>{t('play.waitingTitle')}</h2>
          </motion.div>
          <p>{t('play.waiting')}</p>
          {myEnv && (
            <p className="multi-msg">
              {t('play.environmentChosen')}: <strong>{myEnv.title}</strong>
            </p>
          )}
          <p className="multi-msg">
            {t('play.questionsTotal', { n: state.questionTotal || 12 })}
          </p>
          <Progress percent={(state.teams.length / maxTeams) * 100} showInfo={false} />
          <p className="multi-msg">
            {state.teams.length}/{maxTeams} {t('admin.teams').toLowerCase()}
          </p>
          <ul className="multi-lobby-teams">
            {state.teams.map((team) => (
              <li key={team.id}>
                {team.name}
                {team.id === teamId ? ` (${t('play.you')})` : ''}
              </li>
            ))}
          </ul>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="multi-page page-container">
      <ScorePopupStack items={popupItems} />

      <div className="multi-room-badge glass-card">
        <span className="multi-room-badge__label">{t('play.currentRoom')}</span>
        <span className="multi-room-badge__code">{state.code}</span>
      </div>

      <div className="multi-player-top glass-card">
        <div>
          <h2>{me?.name}</h2>
          {myEnv && (
            <p className="multi-player-sub">
              {t('admin.environmentCol')}: <strong>{myEnv.title}</strong>
            </p>
          )}
          <p className="multi-player-sub">
            {t('play.score')}: <strong>{me?.score ?? 0}</strong> · {t('play.question')}{' '}
            {state.questionIndex + 1}/{state.questionTotal}
          </p>
        </div>
      </div>

      {state.phase === 'question' && q && (
        <div className="multi-panel glass-card">
          {myEvent && (
            <div className={`multi-event-tag${skipEvent ? ' multi-event-tag--skipped' : ''}`}>
              <p className="multi-event-tag__label">{t('play.eventThisQuestion')}</p>
              <Tag color={skipEvent ? 'default' : EVENT_TAG_COLORS[myEvent] || 'purple'}>
                {skipEvent
                  ? t('play.skipEventOn')
                  : `${t(`play.eventTypes.${myEvent}`)}${
                      myEventAmount > 0 && myEvent !== 'neutral'
                        ? ` · ${t('play.eventAmountLabel', { amount: myEventAmount })}`
                        : ''
                    }`}
              </Tag>
              {canSkipEvent && !me?.answered && (
                <button
                  type="button"
                  className={`multi-skip-event-btn${skipEvent ? ' multi-skip-event-btn--active' : ''}`}
                  onClick={() => {
                    setSkipEvent((prev) => {
                      const next = !prev;
                      if (next) setTargetTeamId(null);
                      return next;
                    });
                  }}
                >
                  {t('play.skipEvent')}
                </button>
              )}
            </div>
          )}

          {needsTarget && !me?.answered && (
            <div className="multi-target-picker">
              <p className="multi-target-picker__label">{t('play.pickTargetTeam')}</p>
              <div className="multi-target-picker__list" role="listbox" aria-label={t('play.pickTargetTeam')}>
                {otherTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    role="option"
                    aria-selected={targetTeamId === team.id}
                    className={`multi-target-btn${
                      targetTeamId === team.id ? ' multi-target-btn--selected' : ''
                    }`}
                    onClick={() => setTargetTeamId(team.id)}
                  >
                    <span className="multi-target-btn__name">{team.name}</span>
                    <span className="multi-target-btn__score">
                      {team.score ?? 0} {t('play.points')}
                    </span>
                  </button>
                ))}
              </div>
              {selectedTarget && (
                <p className="multi-target-picker__hint">
                  {t('play.targetSelected', { name: selectedTarget.name })}
                  {(selectedTarget.score ?? 0) <= 0 && myEvent === 'steal_points' && (
                    <span className="multi-target-picker__warn">
                      {' '}
                      {t('play.stealZeroHint', { name: selectedTarget.name })}
                    </span>
                  )}
                  {(selectedTarget.score ?? 0) <= 0 && myEvent === 'swap_points' && (
                    <span className="multi-target-picker__note">
                      {' '}
                      {t('play.swapZeroHint', { name: selectedTarget.name })}
                    </span>
                  )}
                </p>
              )}
            </div>
          )}
          <div className="multi-player-qhead">
            <span>
              {q.stageTitle} · {t('play.question')} {state.questionIndex + 1}/{state.questionTotal}
            </span>
            <span className={`multi-timer ${timeLeft <= 5 ? 'multi-timer--urgent' : ''}`}>
              {timeLeft}s
            </span>
          </div>
          <Progress
            percent={(timeLeft / 30) * 100}
            showInfo={false}
            strokeColor={timeLeft <= 5 ? '#dc2626' : '#2563eb'}
            size="small"
          />
          <h3 className="multi-q-title">{q.title}</h3>
          <p className="multi-narrative">{q.narrative}</p>
          <div className="multi-answers multi-answers--solo">
            {q.choices.map((c) => {
              const isPicked = me?.answered && chosenIndex === c.index;
              const isOther = me?.answered && chosenIndex !== c.index;
              return (
                <motion.button
                  key={c.index}
                  type="button"
                  className={`multi-answer-btn multi-answer-btn--solo${
                    isPicked ? ' multi-answer-btn--picked' : ''
                  }${isOther ? ' multi-answer-btn--dimmed' : ''}`}
                  style={{
                    borderColor: isPicked
                      ? '#16a34a'
                      : CHOICE_COLORS[c.index % CHOICE_COLORS.length],
                  }}
                  disabled={me?.answered || !canAnswer}
                  onClick={() => handleAnswer(c.index)}
                  whileTap={me?.answered ? {} : { scale: 0.98 }}
                  aria-pressed={isPicked}
                >
                  <span
                    className="multi-answer-btn__num"
                    style={{
                      background: isPicked
                        ? '#16a34a'
                        : CHOICE_COLORS[c.index % CHOICE_COLORS.length],
                    }}
                  >
                    {c.index + 1}
                  </span>
                  <span className="multi-answer-btn__label">{c.label}</span>
                  {isPicked && (
                    <span className="multi-answer-btn__check" aria-label={t('play.yourChoice')}>
                      <CheckOutlined />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
          {feedback && <p className="multi-msg multi-msg--highlight">{feedback}</p>}
          {me?.answered && !feedback && <p className="multi-msg">{t('play.waitNext')}</p>}
        </div>
      )}

      {me && (
        <div className="multi-panel glass-card multi-mini-stats">
          <h4>{t('play.yourStats')}</h4>
          <ul>
            <li>
              {t('stats.passion')}: {me.stats.passion}
            </li>
            <li>
              {t('stats.money')}: {me.stats.money}
            </li>
            <li>
              {t('stats.creativity')}: {me.stats.creativity}
            </li>
            <li>
              {t('stats.mentalHealth')}: {me.stats.mentalHealth}
            </li>
            <li>
              {t('stats.socialRecognition')}: {me.stats.socialRecognition}
            </li>
          </ul>
        </div>
      )}
    </PageTransition>
  );
}
