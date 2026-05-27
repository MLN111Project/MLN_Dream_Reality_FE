import { careers as careerDefs } from '../src/data/careers.js';

const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val));

export const INITIAL_STATS = {
  passion: 85,
  money: 50,
  creativity: 80,
  mentalHealth: 75,
  socialRecognition: 40,
};

export const ZERO_STATS = {
  passion: 0,
  money: 0,
  creativity: 0,
  mentalHealth: 0,
  socialRecognition: 0,
};

export const CAREERS = Object.fromEntries(
  careerDefs.map((c) => [c.id, { baseStats: { ...c.baseStats } }])
);

export const ENVIRONMENTS = {
  corporate: {
    modifiers: { salary: 85, creativity: 35, freedom: 25, mentalHealth: 40, recognition: 45 },
  },
  startup: {
    modifiers: { salary: 55, creativity: 70, freedom: 65, mentalHealth: 35, recognition: 50 },
  },
  ngo: {
    modifiers: { salary: 30, creativity: 60, freedom: 55, mentalHealth: 50, recognition: 70 },
  },
  freelance: {
    modifiers: { salary: 45, creativity: 75, freedom: 80, mentalHealth: 45, recognition: 35 },
  },
  government: {
    modifiers: { salary: 70, creativity: 30, freedom: 20, mentalHealth: 55, recognition: 60 },
  },
};

export function applyCareerBase(stats, career) {
  if (!career?.baseStats) return { ...stats };
  return {
    ...stats,
    passion: clamp((stats.passion + career.baseStats.passion) / 2),
    creativity: clamp((stats.creativity + career.baseStats.creativity) / 2),
    money: clamp((stats.money + career.baseStats.money) / 2),
  };
}

export function applyEnvironment(stats, env) {
  if (!env?.modifiers) return { ...stats };
  const m = env.modifiers;
  return {
    passion: clamp(stats.passion + (m.creativity - 50) * 0.1),
    money: clamp((stats.money + m.salary) / 2),
    creativity: clamp((stats.creativity + m.creativity) / 2),
    mentalHealth: clamp((stats.mentalHealth + m.mentalHealth) / 2),
    socialRecognition: clamp((stats.socialRecognition + m.recognition) / 2),
  };
}

export function applyChoiceEffects(stats, effects) {
  const next = { ...stats };
  Object.entries(effects || {}).forEach(([key, delta]) => {
    if (key in next) next[key] = clamp(next[key] + delta);
  });
  return next;
}

export function determineEnding(stats, flags = {}) {
  const { passion, money, creativity, mentalHealth, socialRecognition } = stats;

  if (
    flags.collectivePath &&
    creativity >= 55 &&
    socialRecognition >= 50 &&
    passion >= 48 &&
    mentalHealth >= 38 &&
    !flags.climbedCorporate
  ) {
    return 'collectiveChange';
  }

  if (mentalHealth < 25 && passion < 35) return 'burnedOut';
  if (money > 75 && passion < 40 && creativity < 40) return 'corporateMachine';
  if (passion < 25 && creativity < 30) return 'dreamAbandoned';
  if (socialRecognition > 65 && passion > 55 && mentalHealth > 45) return 'systemChanger';
  if (creativity > 55 && passion > 45) return 'creativeSurvivor';
  if (mentalHealth < 35) return 'burnedOut';
  if (money > 60 && passion < 50) return 'corporateMachine';
  if (passion < 35) return 'dreamAbandoned';
  return 'creativeSurvivor';
}

/** Multiplayer lobby: chỉ số 0, chưa có lịch sử */
export function createLobbyTeamState() {
  return {
    stats: { ...ZERO_STATS },
    history: [],
    flags: {
      climbedCorporate: false,
      foughtSystem: false,
      walkedAway: false,
      collectivePath: false,
    },
    endingId: null,
    choiceLog: [],
    aiAnalysis: null,
    aiAnalysisStatus: null,
  };
}

/** Khi admin bấm Bắt đầu — áp ngành + môi trường làm chỉ số gốc */
export function bootstrapTeamStatsOnGameStart(team, careerId, environmentId, startLabel = 'Bắt đầu') {
  const career = CAREERS[careerId] || CAREERS.developer;
  const env = ENVIRONMENTS[environmentId] || ENVIRONMENTS.corporate;
  let stats = applyCareerBase({ ...INITIAL_STATS }, career);
  stats = applyEnvironment(stats, env);
  team.stats = stats;
  team.history = [{ label: startLabel, ...stats }];
}

export function initTeamState(careerId, environmentId, startLabel = 'Bắt đầu') {
  const career = CAREERS[careerId] || CAREERS.developer;
  const env = ENVIRONMENTS[environmentId] || ENVIRONMENTS.corporate;
  let stats = applyCareerBase({ ...INITIAL_STATS }, career);
  stats = applyEnvironment(stats, env);
  return {
    stats,
    history: [{ label: startLabel, ...stats }],
    flags: {
      climbedCorporate: false,
      foughtSystem: false,
      walkedAway: false,
      collectivePath: false,
    },
    endingId: null,
    choiceLog: [],
    aiAnalysis: null,
    aiAnalysisStatus: null,
  };
}

export function applyTeamChoice(team, choice, stageLabel) {
  if (choice.flag) {
    team.flags[choice.flag] = true;
    if (choice.flag === 'foughtSystem' || choice.flag === 'walkedAway') {
      team.flags.collectivePath = true;
    }
    if (choice.flag === 'climbedCorporate') {
      team.flags.collectivePath = false;
    }
  }
  team.stats = applyChoiceEffects(team.stats, choice.effects);
  team.history.push({ label: stageLabel, ...team.stats });
}

export function finalizeTeamEnding(team) {
  team.endingId = determineEnding(team.stats, team.flags);
}
