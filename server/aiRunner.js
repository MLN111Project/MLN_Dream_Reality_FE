import {
  buildAnalysisPayload,
  analyzeGameEnd,
  getFallbackAnalysis,
} from '../src/services/aiService.js';

export function buildTeamAnalysisPayload(room, team) {
  return buildAnalysisPayload({
    careerId: room.careerId,
    environmentId: team.environmentId,
    stats: team.stats,
    endingId: team.endingId,
    flags: team.flags,
    history: team.history,
    choices: team.choiceLog || [],
    teamName: team.name,
    score: team.score,
  });
}

export async function runTeamAiAnalysis(room, team) {
  const payload = buildTeamAnalysisPayload(room, team);
  team.aiAnalysisStatus = 'loading';

  try {
    team.aiAnalysis = await analyzeGameEnd(payload);
    team.aiAnalysisStatus = 'ready';
  } catch (err) {
    console.warn('[AI]', team.name, err.code || err.message);
    team.aiAnalysis = getFallbackAnalysis(payload, err.code || err.message);
    team.aiAnalysisStatus = 'ready';
  }
}

export function startRoomAiAnalyses(room, onDone) {
  room.teams.forEach((team) => {
    team.aiAnalysisStatus = 'pending';
    team.aiAnalysis = null;
  });

  Promise.all(
    room.teams.map(async (team) => {
      await runTeamAiAnalysis(room, team);
      onDone?.();
    })
  ).catch((e) => console.error('[AI] room batch failed', e));
}
