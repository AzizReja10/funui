let ctx;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      ctx = new AudioContextClass();
    }
  }
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function playClick() {
  try {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.frequency.value = 1400;
    gain.gain.setValueAtTime(0.06, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.05);
  } catch {
    // Ignore audio failures in restricted environments
  }
}

export function playBell() {
  try {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = 1800;
    gain.gain.setValueAtTime(0.12, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.5);
  } catch {
    // Ignore
  }
}

export function playSweep() {
  try {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.18);
    gain.gain.setValueAtTime(0.05, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.2);
  } catch {
    // Ignore
  }
}
