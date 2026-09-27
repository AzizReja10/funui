import { useState } from "react";
import { Play, Pause, Monitor, RotateCcw } from "lucide-react";
import { WindowsTimeline } from "../ui/WindowsTimeline";
import { OS_LIST } from "../../data/windowsTimelineData";
import { cn } from "../../lib/cn";

export function WindowsTimelineDemo() {
  const [activeItem, setActiveItem] = useState(OS_LIST[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [demoKey, setDemoKey] = useState(0);

  const eraDescriptions = {
    classic: {
      label: "Classic Era",
      detail: "Geometric four-pane flag & bold teal/navy palettes (1985-2000)",
      badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
    },
    aero: {
      label: "Aero Glass Era",
      detail: "Glossy specular highlight overlay & vibrant skeuomorphism (2001-2009)",
      badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    },
    flat: {
      label: "Modern Flat Era",
      detail: "Clean monochromatic vector shapes & unified brand color accents (2012-2021)",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    },
  };

  const currentEra = eraDescriptions[activeItem.era] || eraDescriptions.flat;

  const handleReset = () => {
    setActiveItem(OS_LIST[0]);
    setIsPaused(false);
    setDemoKey((k) => k + 1);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-sm">
      {/* Dynamic ambient color glow that harmonizes with active OS color */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-20 dark:opacity-30 transition-all duration-700"
        style={{ backgroundColor: activeItem.color }}
      />

      {/* Showcase Control Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border/70 bg-surface/40">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-xs"
            style={{ backgroundColor: activeItem.color }}
          />
          <span className="font-heading text-xs font-semibold text-fg tracking-wide">
            Windows Evolution
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border transition-colors",
              currentEra.badgeClass
            )}
          >
            {currentEra.label}
          </span>
        </div>

        {/* Controls: Play/Pause and Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-border bg-bg/80 hover:bg-surface text-xs font-medium text-fg transition-colors cursor-pointer"
            title={isPaused ? "Resume auto-cycling" : "Pause auto-cycling"}
          >
            {isPaused ? (
              <>
                <Play size={12} className="text-emerald-500 fill-emerald-500" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={12} className="text-amber-500 fill-amber-500" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-bg/80 hover:bg-surface text-muted hover:text-fg transition-colors cursor-pointer"
            title="Reset to 1985"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Component Canvas */}
      <div className="relative z-10 px-2 sm:px-4 py-4 sm:py-6">
        <WindowsTimeline
          key={demoKey}
          autoPlay={!isPaused}
          onChange={(item) => setActiveItem(item)}
        />
      </div>

      {/* Footer Info Strip */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-3 border-t border-border/60 bg-surface/50 text-[11px] text-muted">
        <div className="flex items-center gap-2">
          <Monitor size={13} className="text-muted shrink-0" />
          <span>{currentEra.detail}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-mono">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: activeItem.color }}
            />
            {activeItem.color}
          </span>
          <span>•</span>
          <span>Drag track to scrub • Arrow keys to step</span>
        </div>
      </div>
    </div>
  );
}

export default WindowsTimelineDemo;
