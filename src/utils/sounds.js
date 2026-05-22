let audioCtx = null;

function getCtx() {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function resumeCtx() {
  const ctx = getCtx();
  if (ctx?.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, duration, type = 'sine', volume = 0.08, ramp = true) {
  const ctx = resumeCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  if (ramp) {
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  }
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playSound(key) {
  switch (key) {
    case 'click':
      tone(520, 0.06, 'sine', 0.05);
      break;
    case 'dramatic':
      tone(110, 0.5, 'triangle', 0.12);
      setTimeout(() => tone(82, 0.6, 'sawtooth', 0.08), 120);
      break;
    case 'success':
      tone(440, 0.1, 'sine', 0.06);
      setTimeout(() => tone(660, 0.15, 'sine', 0.06), 100);
      break;
    case 'warning':
      tone(200, 0.2, 'square', 0.04);
      break;
    case 'heartbeat':
      playHeartbeat(4);
      break;
    case 'stress':
      tone(90, 0.3, 'sawtooth', 0.03);
      break;
    case 'typing':
      tone(800 + Math.random() * 400, 0.03, 'square', 0.02);
      break;
    case 'notification':
      tone(1200, 0.08, 'sine', 0.04);
      setTimeout(() => tone(900, 0.1, 'sine', 0.03), 80);
      break;
    default:
      break;
  }
}

export function playHeartbeat(beats = 3) {
  const ctx = resumeCtx();
  if (!ctx) return;
  const schedule = (t) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(52, ctx.currentTime + t);
    osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + t + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
    gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + t);
    osc.stop(ctx.currentTime + t + 0.2);
  };
  for (let i = 0; i < beats; i += 1) {
    schedule(i * 0.85);
    schedule(i * 0.85 + 0.28);
  }
}

export function startAmbient(type = 'office') {
  const ctx = resumeCtx();
  if (!ctx) return () => {};
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'brown';
  osc.frequency.value = type === 'office' ? 60 : 40;
  filter.type = 'lowpass';
  filter.frequency.value = 200;
  gain.gain.value = 0.015;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  return () => {
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.6);
  };
}
