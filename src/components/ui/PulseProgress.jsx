import { useEffect, useRef, useState } from "react";
import "./PulseProgress.css";

const CIRC = 2 * Math.PI * 38;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const ease = (x) => x * x * (3 - 2 * x);
const gauss = (u, s) => Math.exp(-(u * u) / (2 * s * s));

/**
 * Props
 *  value           0-100. If omitted, the component simulates progress by itself.
 *  paused          controlled paused state (optional)
 *  onPausedChange  (nextPaused) => void
 *  onComplete      called once when progress reaches 100
 */
export default function PulseProgress({
  value,
  paused: pausedProp,
  onPausedChange,
  onComplete,
}) {
  const controlled = typeof value === "number";
  const [pausedState, setPausedState] = useState(false);
  const [simDone, setSimDone] = useState(false);

  const paused = pausedProp ?? pausedState;
  const done = controlled ? value >= 100 : simDone;
  const theme = done ? "done" : paused ? "pause" : "run";

  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const pathRef = useRef(null);
  const ringRef = useRef(null);
  const colRefs = useRef([]); // [ones, tens, hundreds] .pp-col
  const rollRefs = useRef([]); // matching .pp-roll

  // live values the animation loop reads every frame (no re-renders)
  const live = useRef({ paused, controlled, value, p: 0, shown: 0, k: 0, done, completed: false });
  live.current.paused = paused;
  live.current.controlled = controlled;
  live.current.value = value;
  live.current.done = done;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const root = rootRef.current;
    const L = live.current;
    let W = root.clientWidth;
    let H = root.clientHeight;
    const ro = new ResizeObserver(() => {
      W = root.clientWidth;
      H = root.clientHeight;
    });
    ro.observe(root);

    let raf;
    let tPrev = performance.now();

    const setNum = (v) => {
      const ones = v % 10;
      const tens = Math.floor(v / 10) % 10 + ease(clamp((v % 10) - 9, 0, 1));
      const hund = Math.floor(v / 100) + ease(clamp((v % 100) - 99, 0, 1));
      rollRefs.current[0].style.transform = `translateY(${-ones}em)`;
      rollRefs.current[1].style.transform = `translateY(${-tens}em)`;
      rollRefs.current[2].style.transform = `translateY(${-hund}em)`;
      colRefs.current[1].classList.toggle("pp-off", v < 9);
      colRefs.current[2].classList.toggle("pp-off", v < 99);
    };

    const frame = (t) => {
      const dt = Math.min(0.05, (t - tPrev) / 1000);
      tPrev = t;

      // target progress
      if (L.controlled) {
        L.p = clamp(L.value, 0, 100);
      } else if (!L.paused && !L.done) {
        const surge = 0.5 + 0.5 * Math.sin(t * 0.0011) * Math.sin(t * 0.0027);
        L.p = Math.min(100, L.p + dt * (4 + 10 * surge));
        if (L.p >= 100) setSimDone(true);
      }
      if (L.p >= 100 && !L.completed) {
        L.completed = true;
        onCompleteRef.current?.();
      }
      if (L.p < 100) L.completed = false;

      // smooth follow
      L.shown += (L.p - L.shown) * Math.min(1, dt * 9);
      if (Math.abs(L.p - L.shown) < 0.02) L.shown = L.p;
      L.k += ((L.paused ? 1 : 0) - L.k) * Math.min(1, dt * 5);

      const headX = (W * L.shown) / 100;
      const ly = H / 2;
      fillRef.current.style.width = headX + "px";

      // wave while running, heartbeat spike while paused
      const off = (d) => {
        const run = 7 * Math.sin(d * 0.05 - t * 0.008) * Math.exp(-d / 150);
        const ecg =
          -46 * gauss(d - 28, 7) + 60 * gauss(d - 46, 5) - 24 * gauss(d - 64, 10);
        return run * (1 - L.k) + ecg * L.k;
      };
      let d = `M0,${ly}`;
      for (let x = 0; x < headX; x += 3) {
        d += `L${x.toFixed(1)},${(ly + off(headX - x)).toFixed(1)}`;
      }
      d += `L${headX.toFixed(1)},${(ly + off(0)).toFixed(1)}`;
      pathRef.current.setAttribute("d", d);

      setNum(L.shown);
      ringRef.current.style.strokeDashoffset = CIRC * (1 - L.shown / 100);

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const toggle = () => {
    const L = live.current;
    if (done && !controlled) {
      L.p = 0;
      L.shown = 0;
      setSimDone(false);
      return;
    }
    const next = !paused;
    if (pausedProp === undefined) setPausedState(next);
    onPausedChange?.(next);
  };

  return (
    <div className="pp" data-s={theme} ref={rootRef}>
      <div className="pp-fill" ref={fillRef} />

      <svg className="pp-wire">
        <path ref={pathRef} d="" />
      </svg>

      <div className="pp-pct">
        {[2, 1, 0].map((i) => (
          <div
            key={i}
            className={"pp-col" + (i > 0 ? " pp-h pp-off" : "")}
            ref={(el) => (colRefs.current[i] = el)}
          >
            <div className="pp-roll" ref={(el) => (rollRefs.current[i] = el)}>
              {Array.from({ length: 11 }, (_, n) => (
                <span key={n}>{n % 10}</span>
              ))}
            </div>
          </div>
        ))}
        <span className="pp-sign">%</span>
      </div>

      <button className="pp-btn" onClick={toggle} aria-label="Pause or resume">
        <svg viewBox="0 0 84 84">
          <circle className="pp-ring-track" cx="42" cy="42" r="38" />
          <circle
            className="pp-ring-bar"
            ref={ringRef}
            cx="42"
            cy="42"
            r="38"
            style={{ strokeDasharray: CIRC }}
          />
        </svg>
        <span className="pp-icon pp-play">
          <svg viewBox="0 0 24 24">
            <polygon points="8 5 19 12 8 19 8 5" fill="currentColor" stroke="currentColor" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="pp-icon pp-pause">
          <svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12" /></svg>
        </span>
        <span className="pp-icon pp-reload">
          <svg viewBox="0 0 24 24">
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </span>
      </button>
    </div>
  );
}

export { PulseProgress };
