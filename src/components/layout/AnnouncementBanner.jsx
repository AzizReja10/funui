import { useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

export function AnnouncementBanner({ onSelectFeatured }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside aria-label="Announcement" className="relative w-full bg-neon-lime text-black font-sans text-xs sm:text-[13px] font-semibold py-2 px-4 shadow-sm z-50 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-black text-white text-[10px] uppercase font-mono tracking-widest font-bold">
            NEW
          </span>
          <button
            onClick={onSelectFeatured}
            className="group inline-flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <span>AI SDK AGENTS / 100+ AI agent patterns — just copy & paste</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-black/60 hover:text-black p-1 transition-colors rounded hover:bg-black/10"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
