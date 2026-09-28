import { useState } from "react";
import { UploadCard } from "../ui/UploadCard";
import { Film, Gauge, CheckCircle2 } from "lucide-react";

export function UploadCardDemo() {
  const [speedKey, setSpeedKey] = useState("normal"); // 'fast' | 'normal' | 'cinematic'
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [completedList, setCompletedList] = useState([]);

  const speedSettings = {
    fast: { label: "Turbo (3.5s)", duration: 3.5 },
    normal: { label: "Standard (7.5s)", duration: 7.5 },
    cinematic: { label: "Studio Hi-Res (14s)", duration: 14.0 },
  };

  const samplePresets = [
    { name: "cinematic-reveal-4k.mp4", size: 48 * 1024 * 1024, type: "video/mp4", res: "4K 60fps" },
    { name: "drone_coastline_hdr.mov", size: 124 * 1024 * 1024, type: "video/quicktime", res: "ProRes 422" },
    { name: "motion_graphics_loop.webm", size: 18 * 1024 * 1024, type: "video/webm", res: "Alpha WebM" },
  ];

  const handleComplete = (file) => {
    setCompletedList((prev) => [
      { name: file?.name || "Video upload", time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-2 sm:p-4">
      {/* Top Interactive Preset Strip */}
      <div className="w-full max-w-lg flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-xl border border-border/80 bg-surface/50 backdrop-blur-sm text-xs">
        <div className="flex items-center gap-1.5 text-muted font-medium">
          <Film size={14} className="text-neon-lime" />
          <span>Preset sample:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {samplePresets.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setActivePresetIndex(idx)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                activePresetIndex === idx
                  ? "bg-accent text-accent-fg font-semibold shadow-sm"
                  : "bg-surface-hover text-muted hover:text-fg"
              }`}
            >
              {preset.name.split(".")[0]} <span className="opacity-70 text-[10px]">({preset.res})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main UploadCard Stage */}
      <div className="w-full py-4 flex justify-center">
        <UploadCard
          key={`${activePresetIndex}-${speedKey}`}
          uploadDuration={speedSettings[speedKey].duration}
          initialFile={samplePresets[activePresetIndex]}
          presetFiles={samplePresets}
          onUploadComplete={handleComplete}
          enableSound={true}
        />
      </div>

      {/* Speed & Mode Controls Bottom Bar */}
      <div className="w-full max-w-lg flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface/40 text-xs">
        <div className="flex items-center gap-2 text-muted">
          <Gauge size={14} className="text-accent" />
          <span>Simulation Speed:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {Object.entries(speedSettings).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSpeedKey(key)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                speedKey === key
                  ? "bg-fg text-bg font-semibold"
                  : "text-muted hover:text-fg hover:bg-surface-hover"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Completed Uploads Log */}
      {completedList.length > 0 && (
        <div className="flex flex-col items-center gap-1.5 text-xs text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span className="font-medium text-fg">Latest published:</span>
            <span className="font-mono text-[11px] text-muted">{completedList[0].name}</span>
            <span className="text-[10px] text-muted/70 font-mono">({completedList[0].time})</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default UploadCardDemo;
