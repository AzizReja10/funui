import { useEffect, useRef, useState } from "react";

const FALLBACK = { lat: 22.5726, lon: 88.3639 }; // Kolkata

function useWeather(refreshMs = 10 * 60 * 1000) {
  const [data, setData] = useState(null);
  const coords = useRef(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const { lat, lon } = coords.current;
      try {
        const [w, g] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
          ).then((r) => r.json()),
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          )
            .then((r) => r.json())
            .catch(() => null),
        ]);
        if (!alive) return;
        setData({
          temp: w.current.temperature_2m,
          code: w.current.weather_code,
          city: g?.city || g?.locality || g?.principalSubdivision || "",
        });
      } catch {
        /* keep showing the last value */
      }
    };

    const begin = (pos) => {
      coords.current = pos;
      load();
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => begin({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => begin(FALLBACK),
        { timeout: 8000 }
      );
    } else {
      begin(FALLBACK);
    }

    const id = setInterval(() => coords.current && load(), refreshMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [refreshMs]);

  return data;
}

const MIN = -10; // dial range in °C
const MAX = 50;

const easeOutBack = (x) => {
  const c1 = 1.2, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function useTween(target, duration = 1900) {
  const [v, setV] = useState(0);
  const cur = useRef(0);

  useEffect(() => {
    if (target == null) return;
    const from = cur.current;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const x = Math.min(1, (now - t0) / duration);
      cur.current = from + (target - from) * easeOutBack(x);
      setV(cur.current);
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return v;
}

const TICKS = 61;
const ARC = 240; // degrees the dial covers
const C = 160;   // center of the 320x320 card

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

// temperature fraction -> hue (blue -> teal -> amber -> red)
const HUES = [[0, 215], [0.35, 180], [0.6, 45], [1, 6]];
function hueAt(f) {
  for (let i = 1; i < HUES.length; i++) {
    const [f0, h0] = HUES[i - 1];
    const [f1, h1] = HUES[i];
    if (f <= f1) return h0 + (h1 - h0) * ((f - f0) / (f1 - f0));
  }
  return HUES[HUES.length - 1][1];
}

// point on the dial: 0deg = top, clockwise
const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)];
};

const label = (c) =>
  c === 0 ? "Clear" : c <= 2 ? "Partly cloudy" : c === 3 ? "Overcast"
  : c <= 48 ? "Foggy" : c <= 57 ? "Drizzle" : c <= 67 ? "Rain"
  : c <= 77 ? "Snow" : c <= 82 ? "Showers" : c <= 86 ? "Snow showers"
  : "Thunderstorm";

const BUBBLES = [ // left %, size px, duration s, delay s
  [12, 6, 5, 0], [28, 10, 7, 1.5], [46, 5, 6, 3], [63, 9, 8, 0.8], [80, 7, 5.5, 2.4], [92, 5, 6.5, 4],
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;500&display=swap');
@keyframes pw-wave  { to { transform: translateX(-50%); } }
@keyframes pw-float { 50% { transform: translateY(-8px); } }
@keyframes pw-in    { from { opacity: 0; transform: translateY(26px) scale(.92); } }
@keyframes pw-sheen { 0%, 55% { transform: translateX(-250%) skewX(-18deg); } 100% { transform: translateX(450%) skewX(-18deg); } }
@keyframes pw-rise  { 0% { transform: translateY(0) scale(.5); opacity: 0; } 20% { opacity: .7; } 100% { transform: translateY(-190px) scale(1); opacity: 0; } }
@keyframes pw-blink { 50% { opacity: .3; } }
@keyframes pw-tick  { from { opacity: 0; transform: rotate(-10deg) scale(.88); } }
@keyframes pw-flow  { to { stroke-dashoffset: -34; } }
@keyframes pw-spin  { to { transform: rotate(360deg); } }
@keyframes pw-glow  { 50% { opacity: .55; transform: scale(1.12); } }
@keyframes pw-drift { to { transform: translateX(520px); } }
@keyframes pw-drop  { from { transform: translateY(-20px); } to { transform: translateY(340px); } }
@keyframes pw-snow  { 0% { transform: translate(0,-10px); } 50% { transform: translate(14px,170px); } 100% { transform: translate(-6px,340px); } }
@keyframes pw-flash { 0%,92%,100% { opacity: 0; } 93% { opacity: .5; } 94% { opacity: 0; } 95% { opacity: .35; } 97% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .pw-anim { animation: none !important; } }
`;

const ease = (x) => x * x * (3 - 2 * x);
const ROWS = Array.from({ length: 11 }, (_, n) => n % 10); // extra 0 so 9 rolls into 0

function Roll({ y, hidden }) {
  return (
    <span
      className="inline-block h-[1em] overflow-hidden transition-[max-width,opacity] duration-500"
      style={{ maxWidth: hidden ? 0 : "0.62em", opacity: hidden ? 0 : 1 }}
    >
      <span className="flex flex-col will-change-transform" style={{ transform: `translateY(${-y}em)` }}>
        {ROWS.map((n, i) => (
          <span key={i} className="block h-[1em] w-[0.62em] text-center">{n}</span>
        ))}
      </span>
    </span>
  );
}

const kind = (c) =>
  c <= 1 ? "clear"
  : c <= 3 || c === 45 || c === 48 ? "cloud"
  : (c >= 71 && c <= 77) || c === 85 || c === 86 ? "snow"
  : "rain";

function Sky({ code }) {
  const k = kind(code);

  if (k === "clear")
    return (
      <>
        <div
          className="pw-anim pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full"
          style={{
            background: "repeating-conic-gradient(rgba(255,214,110,.2) 0deg 5deg, transparent 5deg 22deg)",
            WebkitMaskImage: "radial-gradient(circle, #000 15%, transparent 68%)",
            maskImage: "radial-gradient(circle, #000 15%, transparent 68%)",
            animation: "pw-spin 50s linear infinite",
          }}
        />
        <div
          className="pw-anim pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,205,90,.4), transparent 62%)",
            animation: "pw-glow 4s ease-in-out infinite",
          }}
        />
      </>
    );

  if (k === "cloud")
    return [0, 1, 2].map((i) => (
      <span
        key={i}
        className="pw-anim pointer-events-none absolute rounded-full bg-white/15 blur-xl"
        style={{
          top: 30 + i * 34, left: -160, height: 34 + i * 8, width: 120 + i * 30,
          animation: `pw-drift ${22 + i * 9}s linear ${-i * 8}s infinite`,
        }}
      />
    ));

  const storm = code >= 95;
  return (
    <>
      {Array.from({ length: 22 }, (_, i) =>
        k === "snow" ? (
          <span
            key={i}
            className="pw-anim absolute top-0 rounded-full bg-white/80"
            style={{
              left: `${(i * 47) % 100}%`, width: 3 + (i % 3), height: 3 + (i % 3),
              animation: `pw-snow ${5 + (i % 5)}s linear ${-(i % 9)}s infinite`,
            }}
          />
        ) : (
          <span
            key={i}
            className="pw-anim absolute top-0 w-px"
            style={{
              left: `${(i * 37) % 100}%`, height: 14 + (i % 4) * 4,
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,.55))",
              animation: `pw-drop ${0.7 + (i % 5) * 0.12}s linear ${-(i % 7) * 0.15}s infinite`,
            }}
          />
        )
      )}
      {storm && (
        <div className="pw-anim pointer-events-none absolute inset-0 bg-white opacity-0"
             style={{ animation: "pw-flash 6s linear infinite" }} />
      )}
    </>
  );
}

export default function TempCard() {
  const weather = useWeather();
  const shown = useTween(weather ? Math.round(weather.temp) : null);

  const frac = clamp((shown - MIN) / (MAX - MIN), 0, 1);
  const abs = Math.abs(shown);
  const ones = abs % 10;
  const tens = (Math.floor(abs / 10) % 10) + ease(clamp(ones - 9, 0, 1));
  const ready = !!weather;
  const negative = ready && Math.round(shown) < 0;

  const hue = hueAt(frac);
  const accent = `hsl(${hue} 95% 60%)`;
  const deep = `hsl(${hue - 12} 100% 50%)`;
  const level = 16 + frac * 58; // % of the card the liquid covers
  const needle = -ARC / 2 + frac * ARC;

  const cardRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 14}deg) rotateY(${(px - 0.5) * 14}deg) scale(1.04)`;
  };
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <>
      <style>{css}</style>

      {/* outer: entrance + floating */}
      <div
        className="pw-anim w-80"
        style={{ animation: "pw-in .9s cubic-bezier(.2,.8,.2,1) both, pw-float 7s ease-in-out .9s infinite" }}
      >
        {/* inner: the card */}
        <div
          ref={cardRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="group relative h-80 w-80 select-none overflow-hidden rounded-[56px] bg-[#0c0d11] text-white shadow-[0_40px_90px_-30px_rgba(0,0,0,.75)] outline-none ring-1 ring-white/10 transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white/60"
          style={{ fontFamily: "'Sora', system-ui, sans-serif" }}
        >
          {ready && <Sky code={weather.code} />}

          {/* liquid */}
          <div
            className="absolute inset-x-0 bottom-0 h-full will-change-transform"
            style={{ transform: `translateY(${100 - level}%)` }}
          >
            <svg
              className="pw-anim absolute left-0 h-6 w-[200%]"
              style={{ top: -22, animation: "pw-wave 6s linear infinite" }}
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
            >
              <path d="M0 30Q150 0 300 30T600 30T900 30T1200 30V60H0Z" fill={accent} opacity=".5" />
            </svg>
            <svg
              className="pw-anim absolute left-0 h-6 w-[200%]"
              style={{ top: -18, animation: "pw-wave 9s linear infinite reverse" }}
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
            >
              <path d="M0 30Q150 60 300 30T600 30T900 30T1200 30V60H0Z" fill={accent} />
            </svg>
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, ${accent}, ${deep})` }}
            />
            {BUBBLES.map(([left, size, dur, delay], i) => (
              <span
                key={i}
                className="pw-anim absolute bottom-0 rounded-full bg-white/60"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size,
                  animation: `pw-rise ${dur}s ease-in ${delay}s infinite`,
                }}
              />
            ))}
          </div>

          {/* glass highlight + sweeping sheen */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,.12), transparent 40%)" }}
          />
          <div
            className="pw-anim pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background: "linear-gradient(to right, transparent, rgba(255,255,255,.14), transparent)",
              animation: "pw-sheen 7s ease-in-out infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "radial-gradient(circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,.22), transparent 45%)" }}
          />

          {/* dial */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 320">
            {ready && frac > 0.01 && (() => {
              const [sx, sy] = polar(143, -ARC / 2);
              const [ex, ey] = polar(143, needle);
              const d = `M${sx} ${sy}A143 143 0 ${frac * ARC > 180 ? 1 : 0} 1 ${ex} ${ey}`;
              return (
                <>
                  <path d={d} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 6px ${accent})` }} />
                  <path d={d} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray="1 16" className="pw-anim"
                        style={{ animation: "pw-flow 1.2s linear infinite" }} />
                </>
              );
            })()}
            {Array.from({ length: TICKS }, (_, i) => {
              const deg = -ARC / 2 + (i * ARC) / (TICKS - 1);
              const major = i % 5 === 0;
              const [x1, y1] = polar(major ? 118 : 123, deg);
              const [x2, y2] = polar(132, deg);
              const lit = ready && i / (TICKS - 1) <= frac;
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={lit ? "#fff" : "rgba(255,255,255,.18)"}
                  strokeWidth={major ? 2.4 : 1.4}
                  strokeLinecap="round"
                  className="pw-anim"
                  style={{ transformOrigin: "160px 160px", animation: `pw-tick .7s cubic-bezier(.2,.8,.2,1) ${i * 14}ms both` }}
                />
              );
            })}
            {ready && (
              <g transform={`rotate(${needle} ${C} ${C})`}>
                <circle
                  cx={C} cy={C - 126} r="5.5" fill="#fff"
                  style={{ filter: `drop-shadow(0 0 8px ${accent}) drop-shadow(0 0 16px ${accent})` }}
                />
              </g>
            )}
          </svg>

          {/* text */}
          <span
            className="absolute inset-x-0 top-[62px] text-center text-[11px] font-medium uppercase tracking-[0.42em] text-white/70"
            style={ready ? undefined : { animation: "pw-blink 1.4s ease-in-out infinite" }}
          >
            {ready ? label(weather.code) : "Locating"}
          </span>

          <div className="absolute inset-0 flex items-center justify-center pb-3">
            <span className="flex h-[1em] text-[128px] font-extralight leading-none tracking-tighter">
              {ready ? (
                <>
                  {negative && <span className="block w-[0.4em] text-center">−</span>}
                  <Roll y={tens} hidden={abs < 9} />
                  <Roll y={ones} />
                </>
              ) : (
                <span style={{ animation: "pw-blink 1.4s ease-in-out infinite" }}>--</span>
              )}
            </span>
            <span className="-mt-16 ml-1 text-2xl font-light text-white/70">°C</span>
          </div>

          <span className="absolute inset-x-0 bottom-8 text-center text-sm font-medium tracking-wide text-white/90">
            {ready ? weather.city : ""}
          </span>
        </div>
      </div>
    </>
  );
}

export { TempCard };
