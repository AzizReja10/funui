import { useState } from "react";
import PulseProgress from "../ui/PulseProgress";
import { Sparkles, Sliders, RotateCcw } from "lucide-react";

export function PulseProgressDemo() {
  const [mode, setMode] = useState("auto"); // "auto" | "controlled"
  const [progressVal, setProgressVal] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [demoKey, setDemoKey] = useState(0);

  const handleComplete = () => {
    setCompletionCount((c) => c + 1);
  };

  const handleReset = () => {
    setDemoKey((k) => k + 1);
    setIsPaused(false);
    if (mode === "controlled") setProgressVal(0);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-2 sm:p-4">
      {/* Controls Bar */}
      <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border border-border/80 bg-surface/60 backdrop-blur-md text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("auto");
              setDemoKey((k) => k + 1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              mode === "auto"
                ? "bg-accent text-accent-fg font-semibold shadow-sm"
                : "bg-surface-hover text-muted hover:text-fg"
            }`}
          >
            <Sparkles size={13} />
            <span>Autonomous Sim</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("controlled");
              setDemoKey((k) => k + 1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              mode === "controlled"
                ? "bg-accent text-accent-fg font-semibold shadow-sm"
                : "bg-surface-hover text-muted hover:text-fg"
            }`}
          >
            <Sliders size={13} />
            <span>Controlled</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {mode === "controlled" && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-muted text-[11px]">{progressVal}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-24 sm:w-28 accent-neon-lime cursor-pointer"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            title="Reset component"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-hover text-muted hover:text-fg transition-colors"
          >
            <RotateCcw size={13} />
            <span className="text-[11px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Main PulseProgress Stage */}
      <div className="w-full max-w-xl h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-border/80 relative">
        <PulseProgress
          key={`${mode}-${demoKey}`}
          value={mode === "controlled" ? progressVal : undefined}
          paused={mode === "controlled" ? isPaused : undefined}
          onPausedChange={setIsPaused}
          onComplete={handleComplete}
        />
      </div>

      {/* Info indicator */}
      <div className="flex items-center gap-3 text-xs text-muted font-mono">
        <span>Click circular button inside stage to toggle pause / resume / restart</span>
        {completionCount > 0 && (
          <span className="text-emerald-500 font-semibold">• Completed: {completionCount}x</span>
        )}
      </div>
    </div>
  );
}
