const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val));

export const INITIAL_STATS = {
  passion: 85,
  money: 50,
  creativity: 80,
  mentalHealth: 75,
  socialRecognition: 40,
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

export function determineEnding(stats) {
  const { passion, money, creativity, mentalHealth, socialRecognition } = stats;

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

export function getStressLevel(stats) {
  return clamp(100 - stats.mentalHealth + (100 - stats.passion) * 0.3);
}

export function getSuppressionLevel(stats) {
  return clamp(100 - stats.creativity + (100 - stats.passion) * 0.2);
}

export function buildChartHistory(history) {
  return history.map((point, i) => ({
    stage: point.label || `Step ${i + 1}`,
    passion: point.passion,
    stress: 100 - point.mentalHealth,
    creativity: point.creativity,
    money: point.money,
  }));
}
