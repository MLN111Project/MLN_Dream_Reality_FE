const EVENT_POOL = [
  { id: 'neutral', weight: 28 },
  { id: 'bonus_points', weight: 22 },
  { id: 'penalty_points', weight: 18 },
  { id: 'steal_points', weight: 18 },
  { id: 'swap_points', weight: 14 },
];

const POINT_MIN = 8;
const POINT_MAX = 30;

export function rollPointAmount(min = POINT_MIN, max = POINT_MAX) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rollTeamEvent() {
  const total = EVENT_POOL.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const ev of EVENT_POOL) {
    r -= ev.weight;
    if (r <= 0) return ev.id;
  }
  return 'neutral';
}

/** Mỗi nhóm một sự kiện riêng cho câu hỏi hiện tại */
export function assignTeamEventsForQuestion(room) {
  room.teams.forEach((team) => {
    team.activeEvent = rollTeamEvent();
    team.eventAmount = rollPointAmount();
  });
}

export function eventRequiresTarget(eventId) {
  return eventId === 'steal_points' || eventId === 'swap_points';
}

export function resolveTargetTeam(room, actorId, targetTeamId) {
  if (!targetTeamId) return null;
  const target = room.teams.find((t) => t.id === targetTeamId);
  if (!target || target.id === actorId) return null;
  return target;
}

function clampScore(v) {
  return Math.max(0, Math.min(9999, Math.round(v)));
}

/** Áp dụng sự kiện của chính nhóm khi trả lời */
export function applyAnswerEvent(room, team, targetTeamId = null, skipEvent = false) {
  const eventId = team.activeEvent || 'neutral';
  const amount = team.eventAmount || rollPointAmount();
  const target = resolveTargetTeam(room, team.id, targetTeamId);
  let pointsDelta = 5;
  let messageKey = 'neutral';
  const details = { amount };

  if (skipEvent && eventId !== 'neutral') {
    team.score = clampScore(team.score + pointsDelta);
    return {
      pointsDelta,
      messageKey: 'event_skipped',
      eventId,
      eventAmount: team.eventAmount || 0,
      details: { skipped: true, pointsDelta },
    };
  }

  switch (eventId) {
    case 'bonus_points':
      pointsDelta += amount;
      messageKey = 'bonus_points';
      break;
    case 'penalty_points':
      pointsDelta -= amount;
      messageKey = 'penalty_points';
      break;
    case 'steal_points': {
      const victim = target;
      const stealTarget = amount;
      if (victim) {
        const stolen = victim.score > 0 ? Math.min(stealTarget, victim.score) : 0;
        details.stolen = stolen;
        details.stolenFrom = victim.name;
        details.stealTarget = stealTarget;
        if (stolen > 0) {
          victim.score = clampScore(victim.score - stolen);
          pointsDelta += stolen;
          messageKey = 'steal_points';
        } else {
          messageKey = 'steal_points_empty';
        }
      } else {
        pointsDelta += Math.max(5, Math.floor(amount / 2));
        messageKey = 'steal_points_fail';
      }
      break;
    }
    case 'swap_points': {
      const other = target;
      if (other) {
        const myBefore = team.score;
        const theirBefore = other.score;
        team.score = clampScore(theirBefore);
        other.score = clampScore(myBefore);
        pointsDelta = team.score - myBefore;
        details.swappedWith = other.name;
        details.scoreBefore = myBefore;
        details.scoreAfter = team.score;
        messageKey = 'swap_points';
      } else {
        pointsDelta += Math.floor(amount / 2);
        messageKey = 'swap_points_fail';
      }
      break;
    }
    default:
      pointsDelta += Math.floor(amount / 3);
      messageKey = 'neutral';
      break;
  }

  team.score = clampScore(team.score + pointsDelta);
  return {
    pointsDelta,
    messageKey,
    eventId,
    eventAmount: amount,
    details: { ...details, pointsDelta },
  };
}
