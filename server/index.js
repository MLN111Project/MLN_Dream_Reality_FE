import { readFileSync, existsSync } from 'fs';
import { createServer } from 'http';

function loadDotEnv() {
  const path = new URL('../.env', import.meta.url);
  if (!existsSync(path)) return;
  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq < 1) return;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    });
}

loadDotEnv();
import { Server } from 'socket.io';
import {
  createRoom,
  addTeam,
  startGame,
  submitAnswer,
  advanceQuestion,
  publicRoomState,
  QUESTION_DURATION_MS,
  TIMELINE_QUESTIONS,
  EXPECTED_QUESTION_COUNT,
} from './gameLogic.js';
import {
  buildAnalysisPayload,
  analyzeGameEnd,
  getFallbackAnalysis,
} from '../src/services/aiService.js';
import { startRoomAiAnalyses } from './aiRunner.js';

const SERVER_BUILD = 'timeline-v2';

const PORT = process.env.PORT || 3001;
const rooms = new Map();

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const httpServer = createServer(async (req, res) => {
  const url = req.url?.split('?')[0];

  if (url === '/health') {
    sendJson(res, 200, {
      ok: true,
      service: 'mln111-game-server',
      build: SERVER_BUILD,
      questionCount: TIMELINE_QUESTIONS.length,
      expected: EXPECTED_QUESTION_COUNT,
      source: 'timeline',
      ai: Boolean(process.env.GEMINI_API_KEY),
    });
    return;
  }

  if (url === '/api/ai/analyze' && req.method === 'POST') {
    let body = {};
    try {
      body = await readJsonBody(req);
      const payload =
        body.metrics || body.rawStats ? body : buildAnalysisPayload(body);
      const analysis = await analyzeGameEnd(payload);
      sendJson(res, 200, { ok: true, analysis });
    } catch (err) {
      if (err.code === 'GEMINI_API_KEY_MISSING') {
        const payload =
          body.metrics || body.rawStats ? body : buildAnalysisPayload(body);
        sendJson(res, 200, {
          ok: true,
          analysis: getFallbackAnalysis(payload, err.code),
        });
        return;
      }
      sendJson(res, 500, { ok: false, error: err.message });
    }
    return;
  }

  sendJson(res, 200, { ok: true, service: 'mln111-game-server', build: SERVER_BUILD });
});

const io = new Server(httpServer, {
  cors: { origin: '*' },
});

function getRoom(code) {
  return rooms.get(code?.toUpperCase());
}

async function broadcastRoom(room) {
  const admin = publicRoomState(room, 'admin');
  const sockets = await io.in(room.code).fetchSockets();
  sockets.forEach((s) => {
    const player =
      s.data.role === 'player' && s.data.teamId
        ? publicRoomState(room, 'player', s.data.teamId)
        : publicRoomState(room, 'player');
    s.emit('room:update', { admin, player });
  });
}

io.on('connection', (socket) => {
  socket.on('admin:create', ({ careerId }, cb) => {
    try {
      const room = createRoom(careerId);
      rooms.set(room.code, room);
      socket.join(room.code);
      socket.data.role = 'admin';
      socket.data.roomCode = room.code;
      cb?.({ ok: true, state: publicRoomState(room, 'admin') });
      broadcastRoom(room);
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  socket.on('admin:join', ({ code }, cb) => {
    const room = getRoom(code?.trim().toUpperCase());
    if (!room) return cb?.({ ok: false, error: 'ROOM_NOT_FOUND' });
    socket.join(room.code);
    socket.data.role = 'admin';
    socket.data.roomCode = room.code;
    cb?.({ ok: true, state: publicRoomState(room, 'admin') });
  });

  socket.on('player:join', ({ code, teamName, environmentId }, cb) => {
    const roomCode = code?.trim().toUpperCase();
    const room = getRoom(roomCode);
    if (!room) {
      console.warn('[player:join] ROOM_NOT_FOUND', roomCode, 'active:', [...rooms.keys()]);
      return cb?.({ ok: false, error: 'ROOM_NOT_FOUND' });
    }
    if (room.phase !== 'lobby') {
      return cb?.({ ok: false, error: 'GAME_STARTED' });
    }
    const name = teamName?.trim();
    if (!name) {
      return cb?.({ ok: false, error: 'INVALID_TEAM_NAME' });
    }
    try {
      const team = addTeam(room, name, environmentId);
      socket.join(room.code);
      socket.data.role = 'player';
      socket.data.roomCode = room.code;
      socket.data.teamId = team.id;
      cb?.({
        ok: true,
        teamId: team.id,
        state: publicRoomState(room, 'player', team.id),
      });
      broadcastRoom(room);
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  socket.on('player:sync', ({ code, teamId }, cb) => {
    const room = getRoom(code);
    if (!room) return cb?.({ ok: false, error: 'ROOM_NOT_FOUND' });
    const team = room.teams.find((t) => t.id === teamId);
    if (!team) return cb?.({ ok: false, error: 'TEAM_NOT_FOUND' });
    socket.join(room.code);
    socket.data.role = 'player';
    socket.data.roomCode = room.code;
    socket.data.teamId = teamId;
    cb?.({ ok: true, state: publicRoomState(room, 'player', teamId) });
  });

  socket.on('admin:start', (_, cb) => {
    const room = getRoom(socket.data.roomCode);
    if (!room) return cb?.({ ok: false });
    try {
      startGame(room);
      cb?.({ ok: true });
      broadcastRoom(room);
      scheduleAutoAdvance(room);
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  socket.on('admin:next', (_, cb) => {
    const room = getRoom(socket.data.roomCode);
    if (!room) return cb?.({ ok: false });
    const { finished } = advanceQuestion(room);
    cb?.({ ok: true });
    broadcastRoom(room);
    if (finished) startRoomAiAnalyses(room, () => broadcastRoom(room));
    else if (room.phase === 'question') scheduleAutoAdvance(room);
  });

  socket.on('admin:music', ({ on, phase }, cb) => {
    const room = getRoom(socket.data.roomCode);
    if (!room) return cb?.({ ok: false });
    if (typeof on === 'boolean') room.musicOn = on;
    if (phase) room.musicPhase = phase;
    cb?.({ ok: true });
    broadcastRoom(room);
  });

  socket.on('player:answer', ({ choiceIndex, targetTeamId, skipEvent }, cb) => {
    const room = getRoom(socket.data.roomCode);
    if (!room) return cb?.({ ok: false });
    const result = submitAnswer(
      room,
      socket.data.teamId,
      choiceIndex,
      targetTeamId,
      Boolean(skipEvent)
    );
    cb?.(result);
    broadcastRoom(room);
  });

  socket.on('disconnect', () => {
    /* teams persist for demo */
  });
});

const timers = new Map();

function scheduleAutoAdvance(room) {
  if (timers.has(room.code)) clearTimeout(timers.get(room.code));
  const id = setTimeout(() => {
    if (room.phase !== 'question') return;
    const { finished } = advanceQuestion(room);
    broadcastRoom(room);
    if (finished) startRoomAiAnalyses(room, () => broadcastRoom(room));
    else if (room.phase === 'question') scheduleAutoAdvance(room);
  }, QUESTION_DURATION_MS);
  timers.set(room.code, id);
}

httpServer.listen(PORT, () => {
  console.log(
    `MLN111 game server http://localhost:${PORT} [${SERVER_BUILD}] — ${TIMELINE_QUESTIONS.length} câu timeline/phòng`
  );
});
