import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./PayFlow.css";

// 7 Domino tile pairs matching standard pip domino games
const DOMINO_PAIRS = [
  [1, 3],
  [2, 5],
  [4, 1],
  [3, 6],
  [5, 2],
  [6, 4],
  [2, 3],
];

// 3x3 Pip grid index maps for numbers 1 to 6
const PIP_MAP = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "del", "0", "go"];

/**
 * Company metadata, tailored loading copy, accents & sound profiles
 */
const COMPANY_CONFIGS = {
  dominos: {
    id: "dominos",
    name: "Dominos",
    status1: "Contacting your bank",
    status2: "Securing your pizza order",
    soundProfile: "dominos",
    tagline: "Domino Physics Fall",
  },
  apple: {
    id: "apple",
    name: "Apple Store",
    status1: "Connecting to Apple Pay network",
    status2: "Authorizing with Secure Enclave",
    soundProfile: "apple",
    tagline: "MagSafe Laser Halo",
  },
  starbucks: {
    id: "starbucks",
    name: "Starbucks",
    status1: "Brewing secure connection",
    status2: "Pouring payment to barista",
    soundProfile: "starbucks",
    tagline: "Artisan Espresso Pour",
  },
  swiggy: {
    id: "swiggy",
    name: "Swiggy",
    status1: "Dispatching payment request",
    status2: "Zooming to merchant gateway",
    soundProfile: "swiggy",
    tagline: "Speed Delivery Scooter",
  },
  netflix: {
    id: "netflix",
    name: "Netflix",
    status1: "Streaming payment session",
    status2: "Buffering your subscription",
    soundProfile: "netflix",
    tagline: "Cinematic Ribbon Prism",
  },
  uber: {
    id: "uber",
    name: "Uber",
    status1: "Routing to banking network",
    status2: "Arriving at destination account",
    soundProfile: "uber",
    tagline: "GPS Route Glide",
  },
  generic: {
    id: "generic",
    name: "Fintech",
    status1: "Contacting payment gateway",
    status2: "Securing tokenized transaction",
    soundProfile: "generic",
    tagline: "Quantum Security Vault",
  },
};

/**
 * Automatically resolve company ID from payee name or explicit company prop
 */
function resolveCompanyId(payee = "", company = "auto") {
  if (company && company !== "auto" && COMPANY_CONFIGS[company]) {
    return company;
  }
  const p = (payee || "").toLowerCase();
  if (p.includes("domino") || p.includes("pizza")) return "dominos";
  if (p.includes("apple") || p.includes("ios") || p.includes("iphone")) return "apple";
  if (p.includes("starbuck") || p.includes("coffee") || p.includes("cafe")) return "starbucks";
  if (p.includes("swiggy") || p.includes("zomato") || p.includes("food")) return "swiggy";
  if (p.includes("netflix") || p.includes("stream") || p.includes("cinema")) return "netflix";
  if (p.includes("uber") || p.includes("ola") || p.includes("ride") || p.includes("cab")) return "uber";
  return "dominos";
}

/**
 * Procedural Web Audio API sound synthesizer tailored per company
 */
class PaySoundSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  tap() {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    } catch {}
  }

  del() {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(350, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.05);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }

  successChime(profile = "dominos") {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;

      if (profile === "apple") {
        // Crisp Apple Pay FaceID chime: F#5 (740 Hz) -> C#6 (1109 Hz) crystal sine
        const notes = [
          { f: 739.99, time: 0.0, dur: 0.28, vol: 0.06 },
          { f: 1108.73, time: 0.12, dur: 0.7, vol: 0.07 },
        ];
        notes.forEach(({ f, time, dur, vol }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t + time);
          gain.gain.setValueAtTime(vol, t + time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + time);
          osc.stop(t + time + dur);
        });
      } else if (profile === "starbucks") {
        // Warm mellow coffee chord: E4 -> G#4 -> B4 -> E5
        const notes = [
          { f: 329.63, time: 0.0, dur: 0.45, vol: 0.05 },
          { f: 415.3, time: 0.08, dur: 0.5, vol: 0.05 },
          { f: 493.88, time: 0.16, dur: 0.55, vol: 0.06 },
          { f: 659.25, time: 0.24, dur: 0.8, vol: 0.06 },
        ];
        notes.forEach(({ f, time, dur, vol }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t + time);
          gain.gain.setValueAtTime(vol, t + time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + time);
          osc.stop(t + time + dur);
        });
      } else if (profile === "swiggy") {
        // Peppy ascending quick triplet: D5 -> F#5 -> A5
        const notes = [
          { f: 587.33, time: 0.0, dur: 0.16, vol: 0.05 },
          { f: 739.99, time: 0.08, dur: 0.2, vol: 0.06 },
          { f: 880.0, time: 0.16, dur: 0.6, vol: 0.07 },
        ];
        notes.forEach(({ f, time, dur, vol }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, t + time);
          gain.gain.setValueAtTime(vol, t + time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + time);
          osc.stop(t + time + dur);
        });
      } else if (profile === "netflix") {
        // Iconic "Ta-Dum" bass drop + radiant shimmer
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = "sawtooth";
        bassOsc.frequency.setValueAtTime(73.42, t);
        bassOsc.frequency.exponentialRampToValueAtTime(55, t + 0.6);
        bassGain.gain.setValueAtTime(0.1, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + 0.65);

        const notes = [
          { f: 587.33, time: 0.2, dur: 0.6, vol: 0.06 },
          { f: 880.0, time: 0.26, dur: 0.75, vol: 0.07 },
        ];
        notes.forEach(({ f, time, dur, vol }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t + time);
          gain.gain.setValueAtTime(vol, t + time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + time);
          osc.stop(t + time + dur);
        });
      } else if (profile === "uber") {
        // Clean radar confirmation ping: A5 -> E6
        const notes = [
          { f: 880.0, time: 0.0, dur: 0.14, vol: 0.05 },
          { f: 1318.51, time: 0.07, dur: 0.55, vol: 0.07 },
        ];
        notes.forEach(({ f, time, dur, vol }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t + time);
          gain.gain.setValueAtTime(vol, t + time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + time);
          osc.stop(t + time + dur);
        });
      } else {
        // Dominos / default four-note victory chime (C5 -> E5 -> G5 -> C6)
        const notes = [
          { f: 523.25, time: 0.0, dur: 0.35, vol: 0.06 },
          { f: 659.25, time: 0.08, dur: 0.4, vol: 0.06 },
          { f: 783.99, time: 0.16, dur: 0.55, vol: 0.07 },
          { f: 1046.5, time: 0.24, dur: 0.75, vol: 0.07 },
        ];
        notes.forEach(({ f, time, dur, vol }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t + time);
          gain.gain.setValueAtTime(vol, t + time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + time);
          osc.stop(t + time + dur);
        });
      }
    } catch {}
  }
}

/**
 * 1. Dominos Animation: Iconic domino tiles toppling in cascade
 */
function DominosAnimation({ isRunning }) {
  return (
    <div className={`pf-anim-dominos pf-row -mt-6 ${isRunning ? "pf-run" : ""}`} id="row">
      {DOMINO_PAIRS.map(([p1, p2], i) => {
        const isLast = i === DOMINO_PAIRS.length - 1;
        return (
          <div
            key={i}
            className={`pf-tile ${isLast ? "last" : ""}`}
            style={{ "--i": i }}
          >
            <div className="pf-half">
              {[...Array(9)].map((_, idx) => (
                <i key={idx} className={PIP_MAP[p1].includes(idx) ? "pf-pip" : ""} />
              ))}
            </div>
            <div className="pf-half">
              {[...Array(9)].map((_, idx) => (
                <i key={idx} className={PIP_MAP[p2].includes(idx) ? "pf-pip" : ""} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 2. Apple Animation: MagSafe Laser Ring with iridescent shimmer & biometric scan
 */
function AppleAnimation({ isRunning }) {
  return (
    <div className={`pf-anim-apple ${isRunning ? "pf-run" : ""}`}>
      <div className="pf-apple-halo">
        <div className="pf-apple-conic" />
        <div className="pf-apple-ring pf-ring-1" />
        <div className="pf-apple-ring pf-ring-2" />
        <div className="pf-apple-sparkle pf-sp-1" />
        <div className="pf-apple-sparkle pf-sp-2" />
        <div className="pf-apple-sparkle pf-sp-3" />

        <div className="pf-apple-disc">
          <svg className="pf-apple-logo" viewBox="0 0 170 170" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.82-11.89-14.34-5.99-9.25-10.74-19.8-14.25-31.65-3.51-11.85-5.27-23.2-5.27-34.05 0-14.03 3.65-25.75 10.96-35.17 7.31-9.42 16.59-14.27 27.84-14.56 5.69 0 11.66 1.63 17.9 4.89 6.24 3.25 10.5 4.93 12.78 5.03 1.94 0 6.42-1.8 13.43-5.41 7.01-3.61 13.36-5.16 19.06-4.66 14.72 1.15 26.24 6.78 34.56 16.9-13.06 7.9-19.46 18.84-19.2 32.82.26 10.87 4.35 19.98 12.28 27.33 7.93 7.35 17.51 11.62 28.74 12.82-2.35 7.15-5.06 14.15-8.13 21zm-28.53-125.6c0 6.84-2.4 13.32-7.2 19.44-5.8 7.2-13.05 11.59-21.75 13.16-.13-1.42-.2-2.61-.2-3.57 0-6.84 2.68-13.78 8.04-20.82 5.36-7.04 12.39-11.45 21.11-13.21z" />
          </svg>
          <div className="pf-apple-scanner" />
        </div>
      </div>
    </div>
  );
}

/**
 * 3. Starbucks Animation: Artisan espresso pour, rising steam & cup fill
 */
function StarbucksAnimation({ isRunning }) {
  return (
    <div className={`pf-anim-starbucks ${isRunning ? "pf-run" : ""}`}>
      {/* Espresso drip stream from above */}
      <div className="pf-sb-dropper">
        <div className="pf-sb-stream" />
        <div className="pf-sb-drop pf-d1" />
        <div className="pf-sb-drop pf-d2" />
      </div>

      {/* Undulating steam wisps */}
      <div className="pf-sb-steam-wrap">
        <svg className="pf-sb-steam pf-steam-1" viewBox="0 0 24 50" fill="none">
          <path d="M12 48 C6 36 18 24 12 14 C8 7 14 3 12 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <svg className="pf-sb-steam pf-steam-2" viewBox="0 0 24 50" fill="none">
          <path d="M12 48 C18 36 6 24 12 14 C16 7 10 3 12 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <svg className="pf-sb-steam pf-steam-3" viewBox="0 0 24 50" fill="none">
          <path d="M12 48 C8 36 16 24 12 14 C9 8 13 3 12 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ceramic Starbucks Cup */}
      <div className="pf-sb-cup">
        <div className="pf-sb-liquid">
          <div className="pf-sb-crema" />
        </div>

        {/* Siren medallion logo */}
        <div className="pf-sb-badge">
          <div className="pf-sb-badge-inner">
            <svg viewBox="0 0 32 32" className="pf-sb-star" fill="currentColor">
              <circle cx="16" cy="16" r="14" fill="#006241" />
              <path d="M16 6 L18.8 12.2 L25.5 12.8 L20.4 17.3 L21.9 23.9 L16 20.4 L10.1 23.9 L11.6 17.3 L6.5 12.8 L13.2 12.2 Z" fill="#fff" />
            </svg>
          </div>
        </div>
        <div className="pf-sb-handle" />
      </div>

      <div className="pf-sb-saucer" />
    </div>
  );
}

/**
 * 4. Swiggy Animation: Fast delivery partner scooter with spinning wheels & road lines
 */
function SwiggyAnimation({ isRunning }) {
  return (
    <div className={`pf-anim-swiggy ${isRunning ? "pf-run" : ""}`}>
      {/* Wind speed streaks */}
      <div className="pf-sw-wind">
        <span className="pf-sw-streak pf-w1" />
        <span className="pf-sw-streak pf-w2" />
        <span className="pf-sw-streak pf-w3" />
      </div>

      {/* Scooter with chassis vibration and suspension bounce */}
      <div className="pf-sw-scooter">
        <div className="pf-sw-rider">
          <div className="pf-sw-helmet" />
          <div className="pf-sw-visor" />
        </div>

        {/* Swiggy Orange Food Hotbox */}
        <div className="pf-sw-box">
          <svg viewBox="0 0 24 24" fill="#fff" className="pf-sw-pin-icon" width="13" height="13">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
        </div>

        <div className="pf-sw-frame">
          <div className="pf-sw-headlight" />
          <div className="pf-sw-beam" />
        </div>

        {/* Rapidly spinning wheels */}
        <div className="pf-sw-wheel pf-front">
          <div className="pf-sw-hub" />
          <div className="pf-sw-spoke pf-sp1" />
          <div className="pf-sw-spoke pf-sp2" />
        </div>
        <div className="pf-sw-wheel pf-rear">
          <div className="pf-sw-hub" />
          <div className="pf-sw-spoke pf-sp1" />
          <div className="pf-sw-spoke pf-sp2" />
        </div>

        <div className="pf-sw-exhaust">
          <span className="pf-sw-puff pf-p1" />
          <span className="pf-sw-puff pf-p2" />
        </div>
      </div>

      {/* Racing Road Track */}
      <div className="pf-sw-road">
        <div className="pf-sw-dashes" />
      </div>
    </div>
  );
}

/**
 * 5. Netflix Animation: Cinematic 'N' ribbon with spectral light flare & lens sweep
 */
function NetflixAnimation({ isRunning }) {
  return (
    <div className={`pf-anim-netflix ${isRunning ? "pf-run" : ""}`}>
      {/* Radiating Anamorphic Spectral Rays */}
      <div className="pf-nf-spectrum">
        <div className="pf-nf-beam pf-beam-red" />
        <div className="pf-nf-beam pf-beam-violet" />
        <div className="pf-nf-beam pf-beam-cyan" />
        <div className="pf-nf-beam pf-beam-amber" />
      </div>

      {/* Netflix 'N' 3-part ribbon structure */}
      <div className="pf-nf-n">
        <div className="pf-nf-ribbon pf-ribbon-left" />
        <div className="pf-nf-ribbon pf-ribbon-right" />
        <div className="pf-nf-ribbon pf-ribbon-diag" />
        <div className="pf-nf-flare" />
      </div>

      <div className="pf-nf-glow" />
    </div>
  );
}

/**
 * 6. Uber Animation: GPS Navigation route path with gliding vehicle & beacon
 */
function UberAnimation({ isRunning }) {
  return (
    <div className={`pf-anim-uber ${isRunning ? "pf-run" : ""}`}>
      <div className="pf-ub-map">
        <div className="pf-ub-grid" />

        <svg className="pf-ub-svg" viewBox="0 0 180 100" fill="none">
          {/* Base path */}
          <path
            d="M 20 80 C 60 80, 70 24, 120 24 C 150 24, 155 52, 160 52"
            stroke="rgba(39, 110, 241, 0.18)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Active drawing route */}
          <path
            className="pf-ub-path-active"
            d="M 20 80 C 60 80, 70 24, 120 24 C 150 24, 155 52, 160 52"
            stroke="#276EF1"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Destination Pin & Radar */}
        <div className="pf-ub-pin">
          <span className="pf-ub-radar" />
          <span className="pf-ub-dot" />
        </div>

        {/* Gliding Car */}
        <div className="pf-ub-car">
          <div className="pf-ub-car-body" />
          <div className="pf-ub-car-lights" />
        </div>
      </div>
    </div>
  );
}

/**
 * 7. Generic Fintech Animation: Orbital security rings & encrypted shield
 */
function FintechAnimation({ isRunning }) {
  return (
    <div className={`pf-anim-fintech ${isRunning ? "pf-run" : ""}`}>
      <div className="pf-ft-rings">
        <div className="pf-ft-ring pf-r1" />
        <div className="pf-ft-ring pf-r2" />
        <div className="pf-ft-ring pf-r3" />
        <div className="pf-ft-center">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * PayFlow Component
 * High-craft UPI payment experience featuring interactive PIN entry,
 * bespoke company loading animations, procedural audio synthesis,
 * and spring-loaded success settlement.
 */
export default function PayFlow({
  payee = "Dominos",
  company = "auto",
  amount = 340,
  currency = "₹",
  upiId = "dominos@okhdfc",
  timestamp = "3 Oct 2026, 11:09 pm",
  autoDemo = true,
  demoPin = "482916",
  soundEnabled = false,
  initialScreen = "pin",
  onSuccess,
  onReset,
  className = "",
}) {
  const [pin, setPin] = useState("");
  const [screen, setScreen] = useState(initialScreen); // 'pin' | 'load' | 'done'
  const [isBusy, setIsBusy] = useState(initialScreen !== "pin");

  // Loading screen states
  const [isLoaderRunning, setIsLoaderRunning] = useState(initialScreen === "load");
  const [status1Out, setStatus1Out] = useState(false);
  const [status2State, setStatus2State] = useState("up"); // 'up' | 'active' | 'out'

  // Success screen states
  const [discCentered, setDiscCentered] = useState(true);
  const [discIn, setDiscIn] = useState(false);
  const [tickDrawn, setTickDrawn] = useState(false);
  const [discPop, setDiscPop] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [riseIndex, setRiseIndex] = useState(-1);
  const [displayedAmount, setDisplayedAmount] = useState(0);

  // Active key press feedback state
  const [pressedKey, setPressedKey] = useState(null);

  const synthRef = useRef(null);
  const timeoutsRef = useRef([]);
  const hasAutoPlayedRef = useRef(false);

  // Resolve company styling and animation
  const resolvedCompanyId = useMemo(() => resolveCompanyId(payee, company), [payee, company]);
  const companyConfig = COMPANY_CONFIGS[resolvedCompanyId] || COMPANY_CONFIGS.dominos;

  // Initialize audio synth on demand
  useEffect(() => {
    synthRef.current = new PaySoundSynth();
  }, []);

  const addTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Flash key feedback
  const flashKey = useCallback((k) => {
    setPressedKey(k);
    setTimeout(() => {
      setPressedKey((curr) => (curr === k ? null : curr));
    }, 140);
  }, []);

  // Animate count up
  const animateCountUp = useCallback((targetAmount, durationMs = 1300) => {
    const startTime = performance.now();
    const easeQuart = (t) => 1 - Math.pow(1 - t, 4);

    function step(now) {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const current = Math.round(targetAmount * easeQuart(progress));
      setDisplayedAmount(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }, []);

  // Execute payment flow
  const runPayment = useCallback(async () => {
    setIsBusy(true);

    // 1. PIN -> Loader
    addTimeout(() => {
      setScreen("load");
      setIsLoaderRunning(true);
    }, 470);

    // 2. Status message swap
    addTimeout(() => {
      setStatus1Out(true);
      setStatus2State("active");
    }, 2800);

    addTimeout(() => {
      setStatus2State("out");
    }, 5200);

    // 3. Loader -> Success screen
    addTimeout(() => {
      setScreen("done");
      if (soundEnabled && synthRef.current) {
        synthRef.current.successChime(companyConfig.soundProfile);
      }
    }, 6400);

    // Disc springs into center
    addTimeout(() => {
      setDiscIn(true);
    }, 6850);

    // Tick path draws
    addTimeout(() => {
      setTickDrawn(true);
    }, 7400);

    // Disc pulse pop + ripple expansion
    addTimeout(() => {
      setDiscPop(true);
      setIsRippling(true);
    }, 8000);

    // Disc glides up from center into top position
    addTimeout(() => {
      setDiscCentered(false);
    }, 8700);

    // Amount roll up + staggered rise element reveals
    addTimeout(() => {
      animateCountUp(amount, 1300);
      for (let i = 0; i <= 6; i++) {
        addTimeout(() => {
          setRiseIndex(i);
        }, i * 110);
      }
      onSuccess?.({ amount, payee, upiId, company: resolvedCompanyId });
    }, 9050);
  }, [addTimeout, amount, animateCountUp, companyConfig.soundProfile, onSuccess, payee, resolvedCompanyId, soundEnabled, upiId]);

  // Handle keypad press
  const handlePress = useCallback(
    (k) => {
      if (isBusy) return;

      if (k === "del") {
        if (soundEnabled && synthRef.current) synthRef.current.del();
        setPin((prev) => prev.slice(0, -1));
      } else if (k === "go") {
        if (pin.length === 6) {
          if (soundEnabled && synthRef.current) synthRef.current.tap();
          runPayment();
        }
      } else if (/^\d$/.test(k)) {
        if (pin.length < 6) {
          if (soundEnabled && synthRef.current) synthRef.current.tap();
          setPin((prev) => {
            const next = prev + k;
            return next;
          });
        }
      }
    },
    [isBusy, pin.length, runPayment, soundEnabled]
  );

  // Reset entire flow back to PIN entry
  const handleReset = useCallback(() => {
    clearAllTimeouts();
    setScreen("pin-exit");

    addTimeout(() => {
      setPin("");
      setIsBusy(false);
      setIsLoaderRunning(false);
      setStatus1Out(false);
      setStatus2State("up");
      setDiscCentered(true);
      setDiscIn(false);
      setTickDrawn(false);
      setDiscPop(false);
      setIsRippling(false);
      setRiseIndex(-1);
      setDisplayedAmount(0);
      setScreen("pin");
      onReset?.();
    }, 450);
  }, [addTimeout, clearAllTimeouts, onReset]);

  // Physical keyboard listeners
  useEffect(() => {
    function handleKeyDown(e) {
      if (isBusy || screen !== "pin") return;
      if (/^\d$/.test(e.key)) {
        flashKey(e.key);
        handlePress(e.key);
      } else if (e.key === "Backspace") {
        flashKey("del");
        handlePress("del");
      } else if (e.key === "Enter") {
        flashKey("go");
        handlePress("go");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flashKey, handlePress, isBusy, screen]);

  // Auto-demo simulation on mount
  useEffect(() => {
    if (!autoDemo || hasAutoPlayedRef.current || initialScreen !== "pin") return;
    hasAutoPlayedRef.current = true;

    let delay = 700;
    const digits = demoPin.split("");

    digits.forEach((d) => {
      addTimeout(() => {
        if (isBusy) return;
        flashKey(d);
        if (soundEnabled && synthRef.current) synthRef.current.tap();
        setPin((prev) => (prev.length < 6 ? prev + d : prev));
      }, delay);
      delay += 230;
    });

    addTimeout(() => {
      if (!isBusy) {
        flashKey("go");
        runPayment();
      }
    }, delay + 250);
  }, [addTimeout, autoDemo, demoPin, flashKey, initialScreen, isBusy, runPayment, soundEnabled]);

  // Instant success preview if initialScreen is "done"
  useEffect(() => {
    if (initialScreen !== "done") return;
    addTimeout(() => setDiscIn(true), 400);
    addTimeout(() => setTickDrawn(true), 850);
    addTimeout(() => {
      setDiscPop(true);
      setIsRippling(true);
      if (soundEnabled && synthRef.current) {
        synthRef.current.successChime(companyConfig.soundProfile);
      }
    }, 1450);
    addTimeout(() => setDiscCentered(false), 2150);
    addTimeout(() => {
      animateCountUp(amount, 1200);
      for (let i = 0; i <= 6; i++) {
        addTimeout(() => setRiseIndex(i), i * 110);
      }
    }, 2450);
  }, [addTimeout, amount, animateCountUp, companyConfig.soundProfile, initialScreen, soundEnabled]);

  const isPinReady = pin.length === 6;

  // Render the appropriate company animation
  const renderCompanyAnimation = () => {
    switch (resolvedCompanyId) {
      case "apple":
        return <AppleAnimation isRunning={isLoaderRunning} />;
      case "starbucks":
        return <StarbucksAnimation isRunning={isLoaderRunning} />;
      case "swiggy":
        return <SwiggyAnimation isRunning={isLoaderRunning} />;
      case "netflix":
        return <NetflixAnimation isRunning={isLoaderRunning} />;
      case "uber":
        return <UberAnimation isRunning={isLoaderRunning} />;
      case "dominos":
        return <DominosAnimation isRunning={isLoaderRunning} />;
      default:
        return <FintechAnimation isRunning={isLoaderRunning} />;
    }
  };

  return (
    <main
      className={`pf-phone ${className}`}
      id="phone"
      data-company={resolvedCompanyId}
    >
      {/* Dynamic island hardware camera pill */}
      <div className="pf-island" aria-hidden="true">
        <span className="pf-lens" />
      </div>

      {/* Screen 1: PIN Input */}
      <section
        className={`pf-screen pf-screen-pin ${screen !== "pin" ? "off" : ""}`}
        id="s-pin"
        aria-hidden={screen !== "pin"}
      >
        <div className="text-center pt-8">
          <p className="text-[15px]" style={{ color: "var(--pf-mute)" }}>
            Paying{" "}
            <span style={{ color: "var(--pf-ink)", fontWeight: 600 }}>
              {payee}
            </span>
          </p>
          <p className="mt-2 text-[52px] leading-none font-medium tracking-tight">
            {currency}
            {amount.toLocaleString("en-IN")}
          </p>
        </div>

        <p className="mt-14 text-sm" style={{ color: "var(--pf-mute)" }}>
          Enter your 6-digit UPI PIN
        </p>

        {/* PIN Dots */}
        <div className="pf-dots mt-6" id="dots" role="status" aria-label={`${pin.length} digits entered`}>
          {[...Array(6)].map((_, i) => (
            <i key={i} className={`pf-dot ${i < pin.length ? "on" : ""}`} />
          ))}
        </div>

        <div className="flex-1" />

        {/* 3x4 Keypad */}
        <div className="pf-pad" id="pad">
          {KEYPAD_KEYS.map((k) => {
            const isGo = k === "go";
            const isDel = k === "del";
            const isPressed = pressedKey === k;

            return (
              <button
                key={k}
                type="button"
                className={`pf-key ${isGo ? "pf-go" : ""} ${isGo && isPinReady ? "ready" : ""} ${isPressed ? "press" : ""}`}
                data-k={k}
                aria-label={isGo ? "Submit PIN" : isDel ? "Backspace" : `Number ${k}`}
                onClick={() => handlePress(k)}
              >
                {isDel ? (
                  <svg
                    width="26"
                    height="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5h11v14H9L3 12z" />
                    <path d="M12.5 9.5l5 5M17.5 9.5l-5 5" />
                  </svg>
                ) : isGo ? (
                  <svg
                    width="26"
                    height="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : (
                  k
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Screen 2: Bespoke Company Loader Animation */}
      <section
        className={`pf-screen pf-screen-load justify-center ${screen !== "load" ? "off" : ""}`}
        id="s-load"
        aria-hidden={screen !== "load"}
      >
        {/* Dynamic Company-Themed Animation Stage */}
        <div className="pf-loader-stage">
          {renderCompanyAnimation()}
        </div>

        {/* Tailored bank status crossfade */}
        <div className="pf-status-box">
          <p className={`pf-status ${status1Out ? "out" : ""}`} id="st1">
            {companyConfig.status1}
          </p>
          <p
            className={`pf-status ${status2State === "up" ? "up" : status2State === "out" ? "out" : ""}`}
            id="st2"
          >
            {companyConfig.status2}
          </p>
        </div>
      </section>

      {/* Screen 3: Settlement Success */}
      <section
        className={`pf-screen pf-screen-done pt-20 ${screen !== "done" ? "off" : ""}`}
        id="s-done"
        aria-hidden={screen !== "done"}
      >
        {/* Check disc with transition spinner, spring scale, stroke tick, vertex burst, and radiating ripples */}
        <div
          className={`pf-disc-wrap ${discCentered ? "center" : ""} ${isRippling ? "pf-go-ripple" : ""}`}
          id="disc-wrap"
        >
          {/* Radiating ripples */}
          <span className="pf-ripple" />
          <span className="pf-ripple" />
          <span className="pf-ripple" />

          {/* Celebratory Starburst Particles that pop as tick draws */}
          <div className={`pf-burst-wrap ${tickDrawn ? "active" : ""}`} aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="pf-burst-particle"
                style={{
                  "--angle": `${i * 45}deg`,
                  "--delay": `${(i % 2) * 0.05}s`,
                }}
              />
            ))}
          </div>

          {/* Pre-transition Spinner Ring (spins and transitions directly into the tick mark) */}
          <div className={`pf-pre-spinner ${discIn ? "done" : ""}`} aria-hidden="true">
            <svg viewBox="0 0 96 96" className="pf-spinner-svg">
              <circle cx="48" cy="48" r="40" className="pf-spinner-track" />
              <circle cx="48" cy="48" r="40" className="pf-spinner-arc" />
            </svg>
          </div>

          <div
            className={`pf-check-disc ${discIn ? "in" : ""} ${tickDrawn ? "draw" : ""} ${discPop ? "pop" : ""}`}
            id="disc"
          >
            {/* Diagonal specular glare sheen */}
            <div className="pf-disc-sheen" aria-hidden="true" />

            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="pf-tick-svg">
              {/* Vertex impact micro-burst flash */}
              <g className="pf-vertex-burst">
                <line x1="19" y1="31" x2="16" y2="35" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="19" y1="31" x2="22" y2="35" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="19" y1="31" x2="14" y2="30" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
              </g>

              <path
                className="pf-tick"
                pathLength="1"
                d="M11 23l8 8 15-17"
                stroke="#fff"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Animated amount */}
        <p
          className={`pf-rise mt-8 text-[54px] leading-none font-medium tracking-tight ${riseIndex >= 0 ? "in" : ""}`}
          id="amt"
        >
          {currency}
          {displayedAmount.toLocaleString("en-IN")}
        </p>

        {/* Transaction breakdown text */}
        <p className={`pf-rise mt-4 text-lg font-medium ${riseIndex >= 1 ? "in" : ""}`}>
          Paid to {payee}
        </p>
        <p
          className={`pf-rise mt-1 text-sm font-medium ${riseIndex >= 2 ? "in" : ""}`}
          style={{ color: "var(--pf-soft)" }}
        >
          {upiId}
        </p>
        <p
          className={`pf-rise mt-6 text-[13px] font-medium ${riseIndex >= 3 ? "in" : ""}`}
          style={{ color: "var(--pf-soft)" }}
        >
          {timestamp}
        </p>
        <p
          className={`pf-rise mt-4 text-xs font-medium ${riseIndex >= 4 ? "in" : ""}`}
          style={{ color: "var(--pf-soft)" }}
        >
          Powered by UPI
        </p>

        <div className="flex-1" />

        {/* Action chips */}
        <div className={`pf-rise flex gap-3 mb-4 ${riseIndex >= 5 ? "in" : ""}`}>
          <button
            type="button"
            className="pf-chip"
            onClick={() => alert("Payment receipt captured!")}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" />
            </svg>
            Screenshot
          </button>
          <button
            type="button"
            className="pf-chip"
            onClick={() => alert(`Transaction Reference: UPI/${Math.random().toString(36).substring(2, 10).toUpperCase()}`)}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />
            </svg>
            See details
          </button>
        </div>

        {/* Done / Reset CTA button */}
        <div className={`pf-rise w-full ${riseIndex >= 6 ? "in" : ""}`}>
          <button
            type="button"
            className="pf-cta"
            id="replay"
            onClick={handleReset}
          >
            Done
          </button>
        </div>
      </section>

      {/* Bottom phone home indicator bar */}
      <div className="pf-home-bar" aria-hidden="true" />
    </main>
  );
}
