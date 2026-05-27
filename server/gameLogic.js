import { buildTimelineQuestions } from './timelineQuestions.js';
import {
  createLobbyTeamState,
  bootstrapTeamStatsOnGameStart,
  applyTeamChoice,
  finalizeTeamEnding,
  ENVIRONMENTS,
} from './soloSimulation.js';
import {
  assignTeamEventsForQuestion,
  applyAnswerEvent,
  eventRequiresTarget,
  resolveTargetTeam,
} from './randomEvents.js';

const MAX_TEAMS = 8;
const QUESTION_DURATION_MS = 30000;
export const EXPECTED_QUESTION_COUNT = 12;

const TIMELINE_QUESTIONS = buildTimelineQuestions();

if (TIMELINE_QUESTIONS.length !== EXPECTED_QUESTION_COUNT) {
  throw new Error(
    `Cần ${EXPECTED_QUESTION_COUNT} câu timeline, hiện có ${TIMELINE_QUESTIONS.length}. Kiểm tra src/data/timeline.js và vi.events.`
  );
}

export function createEmptyTeam(name, _careerId, environmentId) {
  const sim = createLobbyTeamState();
  return {
    id: crypto.randomUUID(),
    name,
    environmentId,
    answered: false,
    lastChoiceIndex: null,
    answeredAt: null,
    score: 0,
    lastFeedback: null,
    activeEvent: 'neutral',
    eventAmount: 0,
    ...sim,
  };
}

export function createRoom(careerId) {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return {
    code,
    careerId,
    phase: 'lobby',
    musicOn: true,
    musicPhase: 'lobby',
    questionIndex: -1,
    questionEndsAt: null,
    questionStartedAt: null,
    questions: TIMELINE_QUESTIONS.map((q) => ({
      ...q,
      choices: q.choices.map((c) => ({ ...c })),
    })),
    teams: [],
    classAnalytics: {},
    firstAnswerTeamId: null,
    createdAt: Date.now(),
  };
}

export function addTeam(room, teamName, environmentId) {
  if (room.teams.length >= MAX_TEAMS) {
    throw new Error('ROOM_FULL');
  }
  const envId = typeof environmentId === 'string' ? environmentId.trim() : '';
  if (!envId || !ENVIRONMENTS[envId]) {
    throw new Error('INVALID_ENVIRONMENT');
  }
  const team = createEmptyTeam(teamName.trim(), room.careerId, envId);
  room.teams.push(team);
  return team;
}

export function startGame(room) {
  if (!room.questions.length) throw new Error('NO_QUESTIONS');
  if (!room.teams.length) throw new Error('NO_TEAMS');
  room.phase = 'question';
  room.questionIndex = 0;
  room.questionStartedAt = Date.now();
  room.questionEndsAt = Date.now() + QUESTION_DURATION_MS;
  room.musicPhase = 'gameplay';
  room.firstAnswerTeamId = null;
  room.teams.forEach((team) => {
    bootstrapTeamStatsOnGameStart(team, room.careerId, team.environmentId);
  });
  assignTeamEventsForQuestion(room);
  resetTeamAnswers(room);
}

export function resetTeamAnswers(room) {
  room.teams.forEach((t) => {
    t.answered = false;
    t.lastChoiceIndex = null;
    t.answeredAt = null;
  });
  room.firstAnswerTeamId = null;
}

export function getCurrentQuestion(room) {
  if (room.questionIndex < 0 || room.questionIndex >= room.questions.length) {
    return null;
  }
  return room.questions[room.questionIndex];
}

export function submitAnswer(room, teamId, choiceIndex, targetTeamId = null, skipEvent = false) {
  const team = room.teams.find((t) => t.id === teamId);
  if (!team || team.answered || room.phase !== 'question') {
    return { ok: false };
  }

  const question = getCurrentQuestion(room);
  if (!question) return { ok: false };

  const choice = question.choices[choiceIndex];
  if (!choice) return { ok: false };

  const others = room.teams.filter((t) => t.id !== teamId);
  const willSkip =
    skipEvent && team.activeEvent && team.activeEvent !== 'neutral';
  if (
    !willSkip &&
    eventRequiresTarget(team.activeEvent) &&
    others.length > 0
  ) {
    if (!resolveTargetTeam(room, teamId, targetTeamId)) {
      return { ok: false, error: 'TARGET_REQUIRED' };
    }
  }

  const now = Date.now();
  const startedAt = room.questionStartedAt || now - QUESTION_DURATION_MS;
  const elapsedMs = now - startedAt;
  const isFirstAnswer = !room.firstAnswerTeamId;

  team.answered = true;
  team.lastChoiceIndex = choiceIndex;
  team.answeredAt = now;
  if (isFirstAnswer) room.firstAnswerTeamId = teamId;

  applyTeamChoice(team, choice, question.stageTitle);

  if (!team.choiceLog) team.choiceLog = [];
  team.choiceLog.push({
    stageTitle: question.stageTitle,
    questionTitle: question.title,
    choiceLabel: choice.label,
    choiceIndex,
    effects: choice.effects,
  });

  const eventResult = applyAnswerEvent(room, team, targetTeamId, willSkip);
  team.lastFeedback = eventResult;

  return {
    ok: true,
    points: team.score,
    pointsDelta: eventResult.pointsDelta,
    eventId: eventResult.eventId,
    messageKey: eventResult.messageKey,
    details: { ...eventResult.details, pointsDelta: eventResult.pointsDelta },
    isFirstAnswer,
  };
}

export function advanceQuestion(room) {
  if (room.phase === 'question') {
    room.teams.forEach((team) => {
      if (!team.answered) {
        team.score = Math.max(0, team.score - 5);
      }
    });
  }

  if (room.questionIndex + 1 >= room.questions.length) {
    room.phase = 'ended';
    room.musicPhase = 'result';
    room.questionEndsAt = null;
    room.questionStartedAt = null;
    room.teams.forEach((team) => finalizeTeamEnding(team));
    buildClassAnalytics(room);
    return { finished: true, ended: true };
  }

  room.questionIndex += 1;
  room.questionStartedAt = Date.now();
  room.questionEndsAt = Date.now() + QUESTION_DURATION_MS;
  room.phase = 'question';
  assignTeamEventsForQuestion(room);
  resetTeamAnswers(room);
  return { finished: false, ended: false };
}

function buildClassAnalytics(room) {
  const endingCounts = {};
  room.teams.forEach((t) => {
    const id = t.endingId || 'creativeSurvivor';
    endingCounts[id] = (endingCounts[id] || 0) + 1;
  });
  room.classAnalytics = {
    teamCount: room.teams.length,
    endingCounts,
    leaderboard: [...room.teams]
      .sort((a, b) => b.score - a.score)
      .map((t) => ({ name: t.name, score: t.score, endingId: t.endingId })),
  };
}

function mapTeamPublic(team, includeDetail = false) {
  const base = {
    id: team.id,
    name: team.name,
    environmentId: team.environmentId,
    answered: team.answered,
    score: team.score,
    stats: team.stats,
    endingId: team.endingId,
    lastFeedback: team.lastFeedback,
    activeEvent: team.activeEvent,
    eventAmount: team.eventAmount,
  };
  if (!includeDetail) return base;
  return {
    ...base,
    history: team.history,
    flags: team.flags,
    lastChoiceIndex: team.lastChoiceIndex,
    choiceLog: team.choiceLog || [],
    aiAnalysis: team.aiAnalysis,
    aiAnalysisStatus: team.aiAnalysisStatus,
  };
}

export function publicRoomState(room, role = 'player', teamId = null) {
  const question = getCurrentQuestion(room);
  const qPayload = question
    ? {
        id: question.id,
        stageTitle: question.stageTitle,
        title: question.title,
        narrative: question.narrative,
        choices: question.choices.map((c, i) => ({
          index: i,
          label: c.label,
        })),
      }
    : null;

  const state = {
    code: room.code,
    careerId: room.careerId,
    phase: room.phase,
    musicOn: room.musicOn,
    musicPhase: room.musicPhase,
    questionIndex: room.questionIndex,
    questionTotal: room.questions.length,
    questionEndsAt: room.questionEndsAt,
    question: qPayload,
    teams: room.teams.map((t) => mapTeamPublic(t, role === 'admin')),
    classAnalytics: room.classAnalytics,
    maxTeams: MAX_TEAMS,
  };

  if (role === 'player' && teamId) {
    const me = room.teams.find((t) => t.id === teamId);
    if (me) {
      state.myTeam = mapTeamPublic(me, true);
    }
  }

  return state;
}

export { MAX_TEAMS, QUESTION_DURATION_MS, TIMELINE_QUESTIONS };
