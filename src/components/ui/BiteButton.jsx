import React, { useState, useId, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "../../lib/cn";

export function BiteButton({
  label = "TASTE ME",
  sublabel = "CLICK TO NIBBLE",
  kicker = "JELLY GUMMY",
  className,
  onBite,
  onReset,
}) {
  const [bites, setBites] = useState([]);
  const [crumbs, setCrumbs] = useState([]);
  const [isWobbling, setIsWobbling] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const buttonRef = useRef(null);
  const uniqueId = useId().replace(/[^a-zA-Z0-9-_]/g, "_");
  const maskId = `biteMask_${uniqueId}`;

  // Pre-set perimeter anchor points (fallback if click position isn't detected)
  const edgePoints = [
    { x: 55, y: 16 },
    { x: 110, y: 12 },
    { x: 175, y: 10 },
    { x: 245, y: 12 },
    { x: 300, y: 18 },
    { x: 325, y: 55 },
    { x: 300, y: 92 },
    { x: 245, y: 98 },
    { x: 175, y: 100 },
    { x: 110, y: 98 },
    { x: 55, y: 92 },
    { x: 25, y: 55 },
  ];

  // 3D Parallax Tilt Handler on Hover
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((x - centerX) / centerX) * 7;
    const tiltY = -((y - centerY) / centerY) * 7;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Click & Bite: Permanently removes the bitten area from the Jelly Button!
  const handleClick = (e) => {
    let clickX = 175;
    let clickY = 55;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      clickX = ((e.clientX - rect.left) / rect.width) * 350;
      clickY = ((e.clientY - rect.top) / rect.height) * 110;
    } else {
      const p = edgePoints[Math.floor(Math.random() * edgePoints.length)];
      clickX = p.x;
      clickY = p.y;
    }

    // Trigger squishy jello wobble animation
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 850);

    // Bite radius with slight random variation
    const biteRadius = 22 + Math.random() * 8;

    // Organic tooth bite scallops
    const toothMarks = Array.from({ length: 5 }).map((_, i) => {
      const angle = (i / 5) * Math.PI * 2;
      return {
        cx: clickX + Math.cos(angle) * (biteRadius * 0.72),
        cy: clickY + Math.sin(angle) * (biteRadius * 0.72),
        r: biteRadius * 0.44,
      };
    });

    const newBite = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      x: clickX,
      y: clickY,
      r: biteRadius,
      toothMarks,
    };

    // Keep all bites permanently!
    setBites((prev) => [...prev, newBite]);

    // Spawn 36 bursting jelly droplet particles
    const id = Date.now();
    const particleCount = 36;
    const jellyColors = ["#975fff", "#d2bbfd", "#7c36ff", "#c084fc", "#f3e8ff", "#a855f7"];

    const newCrumbs = Array.from({ length: particleCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 65;
      return {
        id: id + i,
        x: clickX,
        y: clickY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed * 0.6 + (25 + Math.random() * 35),
        r: 1.2 + Math.random() * 3.2,
        dur: (0.7 + Math.random() * 0.5).toFixed(2),
        color: jellyColors[i % jellyColors.length],
      };
    });

    setCrumbs((c) => [...c, ...newCrumbs]);
    onBite?.(bites.length + 1);

    setTimeout(() => {
      setCrumbs((c) => c.filter((n) => !newCrumbs.some((x) => x.id === n.id)));
    }, 1200);
  };

  // Reset Button with 360° spin
  const handleReset = (e) => {
    e.stopPropagation();
    setIsResetting(true);
    setTimeout(() => {
      setBites([]);
      setCrumbs([]);
      setIsResetting(false);
      onReset?.();
    }, 350);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-4 select-none w-full max-w-[400px] mx-auto",
        className
      )}
    >
      {/* Top HUD: Status Bar & Reset Action */}
      <div className="w-full flex items-center justify-between px-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 font-semibold text-[11px]">
            <span>🍇 Jelly Button</span>
          </span>

          <span className="text-muted text-[11px]">
            {bites.length === 0 ? "Untouched" : `Bites: ${bites.length}`}
          </span>
        </div>

        {bites.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-muted hover:text-fg transition-all cursor-pointer px-2.5 py-1 rounded-md border border-border bg-surface hover:bg-surface-hover shadow-2xs active:scale-95"
            title="Restore untouched jelly button"
          >
            <RotateCcw size={11} className={cn(isResetting && "animate-spin")} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* The Tactile Jelly Button */}
      <div
        style={{ perspective: "800px" }}
        className="relative inline-flex items-center justify-center w-full"
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative inline-flex items-center justify-center cursor-pointer outline-none rounded-[45px] transition-transform duration-200 select-none",
            "focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-4 focus-visible:ring-offset-bg",
            isWobbling && "animate-jello",
            !isWobbling && isHovered && "hover:animate-jello",
            isResetting && "animate-[spin_0.35s_ease-in-out]"
          )}
          style={{
            transform: isHovered
              ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
              : undefined,
          }}
          aria-label="Click to bite jelly button"
        >
          <svg
            viewBox="0 0 350 110"
            className="w-[300px] sm:w-[350px] drop-shadow-md transition-all duration-200"
          >
            <defs>
              {/* THE MASK: PERMANENTLY REMOVES EVERY BITTEN AREA */}
              <mask id={maskId}>
                {/* White = Keep visible (the full button body) */}
                <rect x="10" y="10" width="330" height="90" rx="45" fill="white" />

                {/* Black = COMPLETELY & PERMANENTLY REMOVE each bite area! */}
                {bites.map((b) => (
                  <g key={b.id}>
                    <circle cx={b.x} cy={b.y} r={b.r} fill="black" />
                    {b.toothMarks?.map((tm, idx) => (
                      <circle key={idx} cx={tm.cx} cy={tm.cy} r={tm.r} fill="black" />
                    ))}
                  </g>
                ))}
              </mask>

              {/* Jelly 3D Gradients & Filters */}
              <linearGradient id={`jellyGrad_${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(180, 130, 255)" />
                <stop offset="45%" stopColor="rgb(151, 95, 255)" />
                <stop offset="100%" stopColor="rgb(124, 54, 255)" />
              </linearGradient>

              {/* Specular Blur Filter for Gloss Highlights */}
              <filter id={`glossBlur_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" />
              </filter>
            </defs>

            {/* ------------------------------------------------------------- */}
            {/* EVERYTHING INSIDE THIS GROUP GETS REMOVED ON EACH BITE!       */}
            {/* ------------------------------------------------------------- */}
            <g mask={`url(#${maskId})`} key={`bitten-surface-${bites.length}`}>
              {/* 1. Jelly Button Main Body */}
              <rect
                x="10"
                y="10"
                width="330"
                height="90"
                rx="45"
                fill={`url(#jellyGrad_${uniqueId})`}
                className="transition-colors duration-200"
              />

              {/* 2. Top Specular Gloss Highlight (from user's ::before style) */}
              <ellipse
                cx="175"
                cy="18"
                rx="115"
                ry="2.5"
                fill="rgba(250, 250, 250, 0.72)"
                filter={`url(#glossBlur_${uniqueId})`}
              />

              {/* 3. Bottom Specular Gloss Highlight (from user's ::after style) */}
              <ellipse
                cx="175"
                cy="92"
                rx="115"
                ry="2"
                fill="rgba(250, 250, 250, 0.18)"
                filter={`url(#glossBlur_${uniqueId})`}
              />

              {/* 4. Top Inner Light Bevel (box-shadow inset rgb(210, 187, 253)) */}
              <rect
                x="13"
                y="12"
                width="324"
                height="86"
                rx="43"
                fill="none"
                stroke="rgb(210, 187, 253)"
                strokeWidth="3"
                strokeOpacity="0.65"
              />

              {/* 5. Bottom Inner Deep Shadow Bevel (box-shadow inset rgb(124, 54, 255)) */}
              <rect
                x="13"
                y="12"
                width="324"
                height="86"
                rx="43"
                fill="none"
                stroke="rgb(100, 35, 230)"
                strokeWidth="4"
                strokeOpacity="0.45"
              />

              {/* 6. Typography */}
              <text
                x="175"
                y="32"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white/80 text-[11px] font-bold tracking-[0.35em] select-none font-mono"
              >
                {kicker}
              </text>

              <text
                x="175"
                y="59"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-[20px] font-black tracking-[0.24em] select-none font-sans drop-shadow-[0_2px_4px_rgba(80,20,160,0.5)]"
              >
                {label}
              </text>

              <text
                x="175"
                y="82"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white/70 text-[10px] font-mono tracking-[0.28em] select-none uppercase"
              >
                {sublabel}
              </text>
            </g>

            {/* Falling & Bursting Jelly Droplets */}
            {crumbs.map((c) => (
              <circle
                key={c.id}
                cx={c.x}
                cy={c.y}
                r={c.r}
                fill={c.color}
                className="pointer-events-none"
              >
                <animate
                  attributeName="cy"
                  from={c.y}
                  to={c.y + c.dy}
                  dur={`${c.dur}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="cx"
                  from={c.x}
                  to={c.x + c.dx}
                  dur={`${c.dur}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur={`${c.dur}s`}
                  fill="freeze"
                />
              </circle>
            ))}
          </svg>
        </button>
      </div>

      {/* Bottom Micro-hint */}
      <p className="text-[10px] font-mono tracking-wider text-muted uppercase">
        Click to bite & remove that area • Hover to jello wobble
      </p>
    </div>
  );
}

export default BiteButton;
