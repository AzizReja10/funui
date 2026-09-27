import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";
import { OS_LIST } from "../../data/windowsTimelineData";

const AUTO_MS = 2200;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pctFor = (i, count) => (count <= 1 ? 0 : (i / (count - 1)) * 100);

// ---- logo mark -------------------------------------------------------
// Renders the real logo from public folder (`logoSrc`), or falls back to
// the four-pane vector flag mark if none is specified.
export function WinMark({ entry, size = 72, className }) {
  if (entry.logoSrc) {
    return (
      <img
        src={entry.logoSrc}
        alt={entry.name}
        className={cn(
          "h-16 sm:h-20 w-auto max-w-[220px] object-contain select-none drop-shadow-sm transition-all",
          "dark:brightness-105 dark:contrast-105 dark:drop-shadow-[0_0_1.5px_rgba(255,255,255,0.75)]",
          className
        )}
        draggable={false}
      />
    );
  }
  const glossy = entry.era === "aero";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M4 14 L46 8 L46 47 L4 51 Z" fill={entry.color} />
      <path d="M50 7.4 L96 2 L96 46.4 L50 47 Z" fill={entry.color} />
      <path d="M4 55 L46 55.6 L46 94.6 L4 98 Z" fill={entry.color} opacity="0.94" />
      <path d="M50 55.6 L96 56.2 L96 100 L50 99.4 Z" fill={entry.color} opacity="0.94" />
      {glossy && <path d="M4 14 L96 2 L96 30 L4 38 Z" fill="white" opacity="0.22" />}
    </svg>
  );
}

// Per-digit "odometer" roll for the year.
export function RollingNumber({ value, className }) {
  const digits = String(value).split("");
  return (
    <span className={`inline-flex ${className || ""}`}>
      {digits.map((d, i) => (
        <span key={i} className="relative inline-block overflow-hidden" style={{ width: "0.62em", height: "1.1em" }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={d}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

export function CrossfadeText({ value, className }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className || ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="block whitespace-nowrap"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ---- main component -------------------------------------------------------

export function WindowsTimeline({
  items = OS_LIST,
  autoPlay = true,
  autoInterval = AUTO_MS,
  defaultActive = 0,
  onChange,
  className,
}) {
  const [active, setActive] = useState(defaultActive);
  const [playing, setPlaying] = useState(autoPlay);
  const [dragging, setDragging] = useState(false);
  const [dragPct, setDragPct] = useState(null);
  const trackRef = useRef(null);
  const count = items.length;

  useEffect(() => {
    if (!playing || count === 0) return;
    const id = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % count;
        onChange?.(items[next], next);
        return next;
      });
    }, autoInterval);
    return () => clearInterval(id);
  }, [playing, count, autoInterval, items, onChange]);

  function updateFromClientX(clientX) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const fraction = rect.width > 0 ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0;
    const nearest = Math.round(fraction * (count - 1));
    setActive(nearest);
    setDragPct(fraction * 100);
    onChange?.(items[nearest], nearest);
  }

  function onPointerDown(e) {
    setPlaying(false);
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e) {
    if (dragging) {
      updateFromClientX(e.clientX);
    }
  }

  function onPointerUp() {
    setDragging(false);
    setDragPct(null);
    if (autoPlay) setPlaying(true);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => {
        const next = Math.min(count - 1, a + 1);
        onChange?.(items[next], next);
        return next;
      });
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => {
        const next = Math.max(0, a - 1);
        onChange?.(items[next], next);
        return next;
      });
    }
  }

  const displayPct = dragging && dragPct != null ? dragPct : pctFor(active, count);
  const current = items[active] || items[0];

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14 select-none",
        className
      )}
      onMouseEnter={() => !dragging && setPlaying(false)}
      onMouseLeave={() => !dragging && autoPlay && setPlaying(true)}
    >
      {/* logo + year + name — plain, no button/pill chrome */}
      <div className="flex flex-col items-center gap-3 mb-14 min-h-[150px] justify-center">
        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.92 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <WinMark entry={current} size={72} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-center leading-tight">
          <div className="font-sans font-semibold text-2xl text-gray-900 dark:text-zinc-100">
            <RollingNumber value={current.year} />
          </div>
          <CrossfadeText
            value={current.name}
            className="font-sans text-sm text-gray-500 dark:text-zinc-400 mt-0.5"
          />
        </div>
      </div>

      {/* draggable scrubber */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={count - 1}
        aria-valuenow={active}
        aria-valuetext={`${current.name} (${current.year})`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-10 flex items-center cursor-pointer touch-none outline-none focus-visible:ring-2 focus-visible:ring-neon-lime/70 rounded-lg select-none"
      >
        {/* flat reference ticks */}
        <div className="absolute inset-x-0 flex justify-between pointer-events-none px-[1px]">
          {items.map((e, i) => (
            <span
              key={`${e.name}-${e.year}-${i}`}
              className="w-px h-4 bg-gray-300 dark:bg-zinc-700 rounded-full transition-colors"
            />
          ))}
        </div>

        {/* the draggable handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[3px] h-9 bg-gray-900 dark:bg-zinc-100 rounded-full shadow-xs cursor-grab active:cursor-grabbing"
          animate={{ left: `${displayPct}%` }}
          transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 30 }}
        />
      </div>

      {/* year labels */}
      <div className="flex justify-between mt-3 px-[1px]">
        {items.map((e, i) => (
          <span
            key={`${e.name}-${e.year}-${i}`}
            onClick={() => {
              setActive(i);
              onChange?.(items[i], i);
            }}
            className={cn(
              "text-[9px] sm:text-[10px] md:text-[11px] font-mono transition-colors cursor-pointer select-none text-center",
              i === active
                ? "font-bold text-gray-900 dark:text-zinc-100 scale-105"
                : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
            )}
          >
            <span className="hidden sm:inline">{e.year}</span>
            <span className="sm:hidden">'{String(e.year).slice(-2)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default WindowsTimeline;
