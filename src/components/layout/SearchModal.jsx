import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, ArrowRight, CornerDownLeft, Layers, Hash } from "lucide-react";
import { cn } from "../../lib/cn";

export function SearchModal({ isOpen, onClose, items, onSelect }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent, or toggle
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allItems = [
    { slug: "home", name: "Home", category: "Getting Started", description: "FunUI overview, philosophy, and interactive primitives.", tags: ["home", "overview", "intro"] },
    { slug: "installation", name: "Installation Guide", category: "Getting Started", description: "Vite, Next.js, and manual Tailwind setup walkthrough.", tags: ["install", "guide", "setup", "tailwind", "vite", "next"] },
    ...items,
  ];

  const filtered = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  function handleSelect(slug) {
    onSelect(slug);
    onClose();
  }

  function handleInputKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].slug);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-bg shadow-2xl overflow-hidden z-10 transition-all">
        {/* Search input box */}
        <div className="flex items-center px-4 border-b border-border">
          <Search size={16} className="text-muted shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a component, primitive, or tag..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full h-12 bg-transparent text-sm text-fg placeholder:text-muted outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface text-[10px] font-mono text-muted">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <button
                key={item.slug}
                onClick={() => handleSelect(item.slug)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer",
                  selectedIndex === idx
                    ? "bg-surface text-fg"
                    : "text-muted hover:text-fg hover:bg-surface/50"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-surface-hover flex items-center justify-center shrink-0 text-muted">
                    <Layers size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-fg flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-[10px] font-mono text-muted font-normal px-1.5 py-0.2 rounded bg-surface border border-border">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted truncate max-w-xs sm:max-w-sm mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-muted">
                  {selectedIndex === idx && <CornerDownLeft size={13} />}
                </div>
              </button>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-muted">
              No matching components found for "{query}".
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-surface/50 text-[11px] font-mono text-muted">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-neon-lime font-bold">Forma UI Search</span>
        </div>
      </div>
    </div>
  );
}
