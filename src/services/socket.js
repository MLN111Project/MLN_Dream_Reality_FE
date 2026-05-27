import { io } from 'socket.io-client';

/**
 * Dev: Vite proxy /socket.io → :3001 (window.location.origin).
 * Prod (Vercel): bắt buộc VITE_SOCKET_URL = https://your-render-app.onrender.com
 */
function normalizeSocketUrl(raw) {
  if (!raw) return '';
  let url = String(raw).trim().replace(/\/$/, '');
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    url.startsWith('http://')
  ) {
    url = `https://${url.slice(7)}`;
  }
  return url;
}

function resolveSocketUrl() {
  const fromEnv = import.meta.env.VITE_SOCKET_URL;
  if (fromEnv) {
    return normalizeSocketUrl(fromEnv);
  }

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (import.meta.env.PROD) {
    return '';
  }

  return 'http://localhost:3001';
}

const URL = resolveSocketUrl();

let socket;

export function getSocketUrl() {
  return URL;
}

export function isSocketConfigured() {
  return Boolean(URL);
}

export function getSocket() {
  if (!URL) {
    if (import.meta.env.PROD) {
      console.error(
        '[socket] Thiếu VITE_SOCKET_URL trên Vercel. Thêm URL HTTPS của Render (vd. https://xxx.onrender.com) rồi redeploy.'
      );
    }
    return null;
  }
  if (!socket) {
    socket = io(URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      secure: URL.startsWith('https://'),
    });
  }
  return socket;
}

function waitForSocketConnect(s, timeoutMs = 8000) {
  if (!s) return Promise.resolve(false);
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
  if (!URL) {
    return Promise.resolve({ ok: false, error: 'SOCKET_URL_MISSING' });
  }

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
