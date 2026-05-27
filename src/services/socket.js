import { io } from 'socket.io-client';

/** Dev: Vite proxy /socket.io → :3001. Prod: set VITE_SOCKET_URL. */
function resolveSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return window.location.origin;
  }
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:3001`;
}

const URL = resolveSocketUrl();

let socket;

export function getSocketUrl() {
  return URL;
}

export function getSocket() {
  if (!socket) {
    socket = io(URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
    });
  }
  return socket;
}

function waitForSocketConnect(s, timeoutMs = 8000) {
  if (s.connected) return Promise.resolve(true);
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(false);
    }, timeoutMs);

    const onConnect = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(true);
    };

    const onError = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      clearTimeout(timer);
      s.off('connect', onConnect);
      s.off('connect_error', onError);
    };

    s.on('connect', onConnect);
    s.on('connect_error', onError);
    if (!s.connected) s.connect();
  });
}

export function emitAsync(event, payload) {
  const s = getSocket();
  const timeoutMs = 8000;
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, error: 'SOCKET_TIMEOUT' });
    }, timeoutMs);

    const finish = (res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res ?? { ok: false, error: 'NO_RESPONSE' });
    };

    waitForSocketConnect(s, timeoutMs).then((connected) => {
      if (!connected) {
        finish({ ok: false, error: 'SOCKET_CONNECT_FAILED' });
        return;
      }
      try {
        s.emit(event, payload, (res) => finish(res));
      } catch (e) {
        finish({ ok: false, error: e?.message || 'SOCKET_EMIT_ERROR' });
      }
    });
  });
}
