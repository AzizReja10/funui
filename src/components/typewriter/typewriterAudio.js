// ============================================================================
// Authentic Mechanical Typewriter Web Audio Synthesizer (Zero External Files)
// Uses Web Audio API to synthesize low-latency mechanical clicks, bell dings,
// spacebar thuds, and carriage ratchet returns.
// ============================================================================

class TypewriterAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.muted = false;
  }

  init() {
    if (typeof window === "undefined") return;

    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  // Helper to generate a short filtered noise burst (mechanical friction/impact)
  createNoiseBuffer(duration = 0.05) {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Regular Keystroke: Sharp metallic slug strike + lever body resonance
  playKey() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      // Slight pitch variance per stroke for natural mechanical authenticity
      const pitchVariance = 0.92 + Math.random() * 0.16;

      // Layer A: Sharp hammer impact click (Filtered noise burst)
      const noiseBuffer = this.createNoiseBuffer(0.035);
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(2200 * pitchVariance, t);
        noiseFilter.Q.setValueAtTime(3.0, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.9, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(t);
        noise.stop(t + 0.035);
      }

      // Layer B: Mechanical body clack (Oscillator drop)
      const osc = this.ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(380 * pitchVariance, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.045);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.7, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.045);
    } catch {
      // Audio context might fail silently in restricted environments
    }
  }

  // 2. Spacebar: Deeper, heavier wooden/platen mechanical thud
  playSpace() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;

      // Noise layer (lower frequency clunk)
      const noiseBuffer = this.createNoiseBuffer(0.045);
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.setValueAtTime(950, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.85, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(t);
        noise.stop(t + 0.045);
      }

      // Low wooden thud oscillator
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(55, t + 0.055);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.65, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.055);
    } catch {
      // Ignore
    }
  }

  // 3. Backspace: Light metallic ratchet latch release
  playBackspace() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.025);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.4, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.025);
    } catch {
      // Ignore
    }
  }

  // 4. Vintage Brass Margin Bell: Clear metallic ring with natural harmonic decay
  playBell() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;

      // Primary chime tone (~2800 Hz)
      const fundamental = 2780;
      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(fundamental, t);

      const gain1 = this.ctx.createGain();
      gain1.gain.setValueAtTime(0.45, t);
      gain1.gain.exponentialRampToValueAtTime(0.0005, t + 0.85);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);

      osc1.start(t);
      osc1.stop(t + 0.85);

      // High harmonic overtone (~5560 Hz)
      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(fundamental * 2.01, t);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.25, t);
      gain2.gain.exponentialRampToValueAtTime(0.0005, t + 0.45);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      osc2.start(t);
      osc2.stop(t + 0.45);

      // Metallic initial striker ping
      const strikeOsc = this.ctx.createOscillator();
      strikeOsc.type = "triangle";
      strikeOsc.frequency.setValueAtTime(3600, t);
      strikeOsc.frequency.exponentialRampToValueAtTime(1200, t + 0.02);

      const strikeGain = this.ctx.createGain();
      strikeGain.gain.setValueAtTime(0.3, t);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      strikeOsc.connect(strikeGain);
      strikeGain.connect(this.masterGain);

      strikeOsc.start(t);
      strikeOsc.stop(t + 0.02);
    } catch {
      // Ignore
    }
  }

  // 5. Carriage Return Mechanism: Rapid ratchet slide + hard stop thud
  playCarriageReturn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;

      // Multi-tooth ratchet clicks as carriage slides across
      const clickTimes = [0, 0.04, 0.08, 0.12, 0.16];
      clickTimes.forEach((dt) => {
        const osc = this.ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1400, t + dt);
        osc.frequency.exponentialRampToValueAtTime(400, t + dt + 0.015);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, t + dt);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.015);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t + dt);
        osc.stop(t + dt + 0.015);
      });

      // Bell chime right on return
      this.playBell();

      // Final solid carriage lock impact
      const stopTime = t + 0.22;
      const stopOsc = this.ctx.createOscillator();
      stopOsc.type = "sine";
      stopOsc.frequency.setValueAtTime(260, stopTime);
      stopOsc.frequency.exponentialRampToValueAtTime(60, stopTime + 0.06);

      const stopGain = this.ctx.createGain();
      stopGain.gain.setValueAtTime(0.55, stopTime);
      stopGain.gain.exponentialRampToValueAtTime(0.001, stopTime + 0.06);

      stopOsc.connect(stopGain);
      stopGain.connect(this.masterGain);

      stopOsc.start(stopTime);
      stopOsc.stop(stopTime + 0.06);
    } catch {
      // Ignore
    }
  }
}

export const typewriterAudio = new TypewriterAudioEngine();
