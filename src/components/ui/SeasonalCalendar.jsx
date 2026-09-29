import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* npm i framer-motion
   <SeasonalCalendar weekStartsOn={0} onSelect={(date) => console.log(date)} /> */

const SEASONS = {
  winter: {
    label: "Winter", ink: "#17263C", accent: "#3A67A8", soft: "rgba(255,255,255,.6)",
    hills: ["#DCE8F5", "#FFFFFF"], particle: "#FFFFFF",
  },
  spring: {
    label: "Spring", ink: "#3A1F2E", accent: "#C23E6A", soft: "rgba(255,255,255,.6)",
    hills: ["#CDE8BF", "#A7D796"], particle: "#F49AB5",
  },
  summer: {
    label: "Summer", ink: "#2B1F06", accent: "#C4600A", soft: "rgba(255,255,255,.55)",
    hills: ["#FFD988", "#FFC463"], particle: "#FFFBD0",
  },
  autumn: {
    label: "Autumn", ink: "#2A1309", accent: "#B23F1B", soft: "rgba(255,255,255,.5)",
    hills: ["#EDB27A", "#E29A5B"], particle: "#D9622B",
  },
};

/* level = how deep into the season (1 early, 3 peak); grad = top/mid/bottom of that month's own sky; marks = [day, label] */
const MONTHS = [
  { n: "January", s: "winter", level: 3, grad: ["#B9D0EA", "#8DB0DA", "#6C93C6"], quote: "A quiet page, still white, waiting to be written.", marks: [[1, "New Year"]] },
  { n: "February", s: "winter", level: 2, grad: ["#DCE8F6", "#B3CDEA", "#9DBBE0"], quote: "Frost lets go, one small thaw at a time.", marks: [[14, "Valentine's Day"]] },
  { n: "March", s: "spring", level: 1, grad: ["#FFF8F5", "#FBE6E6", "#F6D3DC"], quote: "The first green whisper under melting snow.", marks: [[20, "Spring equinox"]] },
  { n: "April", s: "spring", level: 2, grad: ["#FFF1F5", "#FBCFDD", "#F3A9C2"], quote: "Rain writes softly on the petals' pale skin.", marks: [[22, "Earth Day"]] },
  { n: "May", s: "spring", level: 3, grad: ["#FFE3EC", "#F7A8C4", "#E67FA5"], quote: "Everything blooms as though it were never afraid.", marks: [[1, "May Day"]] },
  { n: "June", s: "summer", level: 2, grad: ["#FFFBEA", "#FFF0BF", "#FFE38F"], quote: "Light lingers, unwilling to say goodnight.", marks: [[21, "Summer solstice"]] },
  { n: "July", s: "summer", level: 3, grad: ["#FFE27A", "#FFC04D", "#FF9A3C"], quote: "Noon hums gold, and time forgets to hurry.", marks: [] },
  { n: "August", s: "summer", level: 2, grad: ["#FFCB6B", "#FF9F4A", "#F2703A"], quote: "The evening leans warm on the shoulder of the sky.", marks: [[12, "Perseid meteors"]] },
  { n: "September", s: "autumn", level: 1, grad: ["#FEF3E2", "#FADFB8", "#F0C58E"], quote: "The year exhales, and the first leaf listens.", marks: [[22, "Autumn equinox"]] },
  { n: "October", s: "autumn", level: 3, grad: ["#F6BC7A", "#E58F47", "#CE6A31"], quote: "The trees blaze gently, one gold leaf at a time.", marks: [[31, "Halloween"]] },
  { n: "November", s: "autumn", level: 2, grad: ["#EBD2B8", "#D3A98A", "#B98366"], quote: "Bare branches keep the last of the light.", marks: [] },
  { n: "December", s: "winter", level: 1, grad: ["#F4F8FD", "#DCE8F5", "#C2D5EA"], quote: "Snow hushes the world into one long, deep breath.", marks: [[21, "Winter solstice"], [25, "Christmas"]] },
];

const LEVEL = [0, 0.55, 0.8, 1];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const LEAVES = ["#F5B041", "#E67E22", "#C0392B", "#F7DC6F"];
const H = 490;

/* ---------- Scene behind the dates; intensity changes depth, density and glow ---------- */
function Scene({ season, intensity, reduce }) {
  const s = SEASONS[season];
  const items = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: (i * 47) % 100,
        size: 6 + ((i * 5) % 9),
        delay: -((i * 0.9) % 9),
        dur: 9 + ((i * 3) % 6),
        drift: ((i * 29) % 70) - 35,
        color: LEAVES[i % 4],
      })),
    [season]
  );
  const count = Math.round(6 + 14 * intensity);
  const rising = season === "summer";
  const shapes = {
    winter: { borderRadius: "50%", boxShadow: "0 0 4px rgba(90,130,180,.35)" },
    spring: { borderRadius: "60% 0 60% 60%" },
    autumn: { borderRadius: "0 85% 0 85%" },
    summer: { borderRadius: "50%", filter: "blur(.5px)" },
  };

  return (
    <motion.div
      className="sc-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      aria-hidden
    >
      {season === "summer" && (
        <motion.div
          className="sc-sun"
          style={{ opacity: 0.35 + 0.65 * intensity }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        />
      )}
      {!reduce &&
        items.slice(0, count).map((p) => (
          <motion.span
            key={p.id}
            className="sc-particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: season === "autumn" ? p.color : s.particle,
              opacity: 0.85,
              ...shapes[season],
            }}
            initial={{ y: rising ? H : -30 }}
            animate={{
              y: rising ? [H, -40] : [-30, H],
              x: [0, p.drift, 0],
              rotate: season === "winter" || rising ? 0 : [0, 240],
            }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      <svg className="sc-hills" style={{ height: 74 + intensity * 20 }} viewBox="0 0 400 120" preserveAspectRatio="none">
        <path d="M0 55 C70 15 130 15 200 50 S340 85 400 40 V120 H0Z" fill={s.hills[0]} />
        <path d="M0 85 C80 55 150 60 220 85 S350 105 400 75 V120 H0Z" fill={s.hills[1]} />
      </svg>
    </motion.div>
  );
}

/* ---------- Month title: season-specific gradient, entrance and ornament ---------- */
const ENTER = (dir) => ({
  winter: { initial: { opacity: 0, letterSpacing: "6px" }, animate: { opacity: 1, letterSpacing: "0px" } },
  spring: { initial: { opacity: 0, y: 16, scale: 0.92 }, animate: { opacity: 1, y: 0, scale: 1 } },
  summer: { initial: { opacity: 0, x: dir * -28 }, animate: { opacity: 1, x: 0 } },
  autumn: { initial: { opacity: 0, y: -22, rotate: -3 }, animate: { opacity: 1, y: 0, rotate: 0 } },
});

function Ornament({ season, reduce }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" };
  const anim = reduce
    ? {}
    : {
        winter: { animate: { rotate: 360 }, transition: { duration: 18, repeat: Infinity, ease: "linear" } },
        spring: { animate: { rotate: [-10, 10, -10] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
        summer: { animate: { rotate: 360 }, transition: { duration: 24, repeat: Infinity, ease: "linear" } },
        autumn: { animate: { rotate: [-16, 16, -16] }, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } },
      }[season];
  const art = {
    winter: <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5" />,
    spring: (
      <>
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="12" cy="6.5" rx="2.8" ry="4.4" transform={`rotate(${r} 12 12)`} fill="currentColor" fillOpacity=".25" />
        ))}
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </>
    ),
    summer: (
      <>
        <circle cx="12" cy="12" r="4.2" fill="currentColor" fillOpacity=".3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </>
    ),
    autumn: <path d="M12 2C6 6 4 12 6 18c2 3 6 4 6 4s4-1 6-4c2-6 0-12-6-16zM12 22V9" fill="currentColor" fillOpacity=".2" />,
  }[season];
  return (
    <motion.svg {...common} className="sc-orn" style={{ originY: season === "autumn" ? 0.1 : 0.5 }} {...anim} aria-hidden>
      {art}
    </motion.svg>
  );
}

/* ---------- Calendar ---------- */
export default function SeasonalCalendar({ initialDate = new Date(), weekStartsOn = 0, onSelect }) {
  const reduce = useReducedMotion();
  const today = new Date();
  const [view, setView] = useState({ y: initialDate.getFullYear(), m: initialDate.getMonth() });
  const [dir, setDir] = useState(1);
  const [selected, setSelected] = useState(null);

  const month = MONTHS[view.m];
  const seasonKey = month.s;
  const s = SEASONS[seasonKey];
  const intensity = LEVEL[month.level];

  const onTodayMonth = view.m === today.getMonth() && view.y === today.getFullYear();
  const isToday = (d) => onTodayMonth && d === today.getDate();
  const key = (d) => `${view.y}-${view.m}-${d}`;
  const markOf = (d) => month.marks.find(([md]) => md === d);

  const go = (delta) => {
    setDir(delta);
    setView(({ y, m }) => {
      const n = m + delta;
      return { y: y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 };
    });
  };
  const jumpToday = () => {
    const cur = view.y * 12 + view.m;
    const target = today.getFullYear() * 12 + today.getMonth();
    setDir(target > cur ? 1 : -1);
    setView({ y: today.getFullYear(), m: today.getMonth() });
  };

  const offset = (new Date(view.y, view.m, 1).getDay() - weekStartsOn + 7) % 7;
  const total = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const weekdays = [...DAYS.slice(weekStartsOn), ...DAYS.slice(0, weekStartsOn)];

  const pick = (d) => {
    setSelected(key(d));
    onSelect?.(new Date(view.y, view.m, d));
  };

  const flip = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { rotateY: dir * 55, opacity: 0, x: dir * 24 },
        animate: { rotateY: 0, opacity: 1, x: 0 },
        exit: { rotateY: dir * -55, opacity: 0, x: dir * -24 },
      };
  const enter = ENTER(dir)[seasonKey];

  return (
    <>
      <style>{css}</style>
      <div className="sc-card" style={{ "--ink": s.ink, "--accent": s.accent, "--soft": s.soft }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={view.m}
            className="sc-bg"
            style={{ background: `linear-gradient(180deg, ${month.grad.join(", ")})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.9, duration: 0.01 } }}
            transition={{ duration: 0.9 }}
          />
        </AnimatePresence>
        <AnimatePresence>
          <Scene key={seasonKey} season={seasonKey} intensity={intensity} reduce={reduce} />
        </AnimatePresence>

        <div className="sc-content">
          <header className="sc-head">
            <div>
              <div className="sc-title">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={view.y + "-" + view.m}
                    className={`sc-month sc-t-${seasonKey}`}
                    {...enter}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {month.n}
                  </motion.h2>
                </AnimatePresence>
                <Ornament key={seasonKey} season={seasonKey} reduce={reduce} />
              </div>
              <p className="sc-year">
                {view.y} · {s.label}
                <span className="sc-meter" role="img" aria-label={`${s.label} intensity ${month.level} of 3`}>
                  {[1, 2, 3].map((n) => (
                    <i key={n} className={n <= month.level ? "on" : ""} />
                  ))}
                </span>
                <AnimatePresence>
                  {!onTodayMonth && (
                    <motion.button
                      className="sc-today-btn"
                      onClick={jumpToday}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      Today
                    </motion.button>
                  )}
                </AnimatePresence>
              </p>
            </div>
            <div className="sc-nav">
              <motion.button whileTap={{ scale: 0.88 }} onClick={() => go(-1)} aria-label="Previous month">‹</motion.button>
              <motion.button whileTap={{ scale: 0.88 }} onClick={() => go(1)} aria-label="Next month">›</motion.button>
            </div>
          </header>

          <div className="sc-glass">
          <div className="sc-weekdays">
            {weekdays.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          <div className="sc-perspective">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view.y + "-" + view.m}
                className="sc-grid"
                {...flip}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {cells.map((d, i) => {
                  if (d === null) return <span key={i} />;
                  const today_ = isToday(d);
                  const past = onTodayMonth && d < today.getDate();
                  const mark = markOf(d);
                  return (
                    <button
                      key={i}
                      className={"sc-day" + (today_ ? " is-today" : "") + (past ? " is-past" : "")}
                      onClick={() => pick(d)}
                      aria-pressed={selected === key(d)}
                      aria-current={today_ ? "date" : undefined}
                      aria-label={`${month.n} ${d}, ${view.y}${mark ? ", " + mark[1] : ""}`}
                      title={mark ? mark[1] : undefined}
                    >
                      {selected === key(d) && !today_ && (
                        <motion.span
                          layoutId="sc-pill"
                          className="sc-pill"
                          transition={{ type: "spring", stiffness: 500, damping: 34 }}
                        />
                      )}
                      {today_ && !reduce && (
                        <motion.span
                          className="sc-pulse"
                          animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      <span className="sc-num">{d}</span>
                      {mark && <i className="sc-dot" />}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.footer
              key={view.y + "-" + view.m}
              className="sc-foot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="sc-quote">{month.quote}</p>
            </motion.footer>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;600&display=swap');
.sc-card{position:relative;max-width:520px;min-height:468px;margin:0 auto;border-radius:24px;overflow:hidden;
  color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;transition:color .8s;box-shadow:0 24px 50px -28px rgba(20,30,50,.4)}
.sc-scene,.sc-bg{position:absolute;inset:0;pointer-events:none}
.sc-particle{position:absolute;top:0;display:block}
.sc-hills{position:absolute;left:0;right:0;bottom:0;width:100%;transition:height .8s}
.sc-sun{position:absolute;top:-95px;right:-95px;width:270px;height:270px;border-radius:50%;
  background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.7) 0 6deg,transparent 6deg 20deg);
  -webkit-mask:radial-gradient(circle,#000 25%,transparent 68%);mask:radial-gradient(circle,#000 25%,transparent 68%)}
.sc-content{position:relative;padding:18px 26px 66px}
.sc-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.sc-title{display:flex;align-items:center;gap:8px;color:var(--accent)}
.sc-month{margin:0;padding-bottom:2px;font:700 28px/1.12 'Fraunces',serif;background-size:200% 100%;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:sc-shine 7s linear infinite}
.sc-t-winter{background-image:linear-gradient(100deg,#0F2D57,#2F5F9E 50%,#0F2D57);filter:drop-shadow(0 1px 0 rgba(255,255,255,.8))}
.sc-t-spring{background-image:linear-gradient(100deg,#6E1A3C,#B0345F 50%,#6E1A3C);filter:drop-shadow(0 1px 0 rgba(255,255,255,.6))}
.sc-t-summer{background-image:linear-gradient(100deg,#7C2504,#D9500F 50%,#7C2504);filter:drop-shadow(0 0 7px rgba(255,236,150,.95))}
.sc-t-autumn{background-image:linear-gradient(100deg,#4E1406,#9C3F12 50%,#4E1406);filter:drop-shadow(0 1px 0 rgba(255,240,215,.7))}
@keyframes sc-shine{from{background-position:0% 0}to{background-position:200% 0}}
.sc-year{margin:4px 0 0;font-size:12.5px;opacity:.85;display:flex;align-items:center;gap:8px}
.sc-meter{display:inline-flex;gap:3px}
.sc-meter i{width:6px;height:6px;border-radius:50%;background:var(--ink);opacity:.2}
.sc-meter i.on{background:var(--accent);opacity:1}
.sc-today-btn{border:1px solid var(--accent);background:rgba(255,255,255,.55);color:var(--accent);border-radius:999px;
  padding:1px 9px;font:600 11.5px 'DM Sans',sans-serif;cursor:pointer}
.sc-nav{display:flex;gap:6px}
.sc-nav button{width:32px;height:32px;border-radius:50%;border:1.5px solid var(--ink);background:rgba(255,255,255,.35);
  color:var(--ink);font-size:17px;line-height:1;cursor:pointer;transition:background .2s}
.sc-nav button:hover{background:rgba(255,255,255,.75)}
.sc-weekdays,.sc-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.sc-weekdays span{text-align:center;font-size:11.5px;font-weight:600;color:var(--accent);padding-bottom:5px}
.sc-glass{padding:8px 6px 4px;border-radius:18px;background:rgba(255,255,255,.42);border:1px solid rgba(255,255,255,.55);
  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.sc-perspective{perspective:1400px}
.sc-grid{transform-origin:left center}
.sc-day{position:relative;height:38px;border:0;background:transparent;border-radius:12px;color:inherit;
  font:600 13.5px 'DM Sans',sans-serif;cursor:pointer;display:grid;place-items:center;transition:background .2s}
.sc-day:hover{background:var(--soft)}
.sc-day.is-past{opacity:.7}
.sc-num{position:relative;z-index:1}
.sc-day.is-today .sc-num{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;
  background:var(--accent);color:#fff;font-weight:700;box-shadow:0 6px 14px -4px var(--accent)}
.sc-pulse{position:absolute;width:30px;height:30px;border-radius:50%;border:2px solid var(--accent)}
.sc-pill{position:absolute;inset:3px;border-radius:12px;background:rgba(255,255,255,.9);border:1.5px solid var(--accent)}
.sc-dot{display:inline-block;width:4px;height:4px;border-radius:50%;background:var(--accent)}
.sc-day .sc-dot{position:absolute;bottom:2px;left:50%;margin-left:-2px}
.sc-foot{position:absolute;left:26px;right:26px;bottom:12px;display:flex;flex-direction:column;gap:2px}
.sc-quote{margin:0;font:italic 500 15px/1.35 'Fraunces',serif}
.sc-day:focus-visible,.sc-nav button:focus-visible,.sc-today-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(prefers-reduced-motion:reduce){.sc-month{animation:none}}
@media(max-width:520px){.sc-content{padding:16px 14px 64px}.sc-foot{left:14px;right:14px}.sc-month{font-size:25px}}
`;

export { SeasonalCalendar };
