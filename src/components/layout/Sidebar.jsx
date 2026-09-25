import { useState, useMemo } from "react";
import { Search, Sparkles, Filter, ChevronRight, Hash } from "lucide-react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";

export function Sidebar({ items, activeSlug, onSelect, onCloseMobile }) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!filterQuery.trim()) return items;
    const q = filterQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [items, filterQuery]);

  // Group items by category
  const categories = useMemo(() => {
    const map = {};
    for (const item of filteredItems) {
      if (!map[item.category]) {
        map[item.category] = [];
      }
      map[item.category].push(item);
    }
    return map;
  }, [filteredItems]);

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-bg/50 backdrop-blur-xs py-6 px-3 flex flex-col h-[calc(100vh-5.5rem)] sticky top-20 overflow-y-auto">
      {/* Quick sidebar filter */}
      <div className="mb-5 px-1">
        <div className="relative flex items-center">
          <Search size={13} className="pointer-events-none absolute left-2.5 text-muted" />
          <input
            type="text"
            placeholder="Filter components..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="h-8 w-full rounded-md border border-border bg-surface pl-8 pr-2.5 text-xs text-fg placeholder:text-muted focus:border-fg/40 focus:outline-none transition-colors"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery("")}
              className="absolute right-2 text-xs text-muted hover:text-fg"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Categorized Component List */}
      <div className="flex-1 space-y-6">
        {Object.entries(categories).map(([categoryName, catItems]) => (
          <div key={categoryName} className="space-y-1">
            <h4 className="px-2.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted">
              {categoryName}
            </h4>

            <div className="pt-1 space-y-0.5">
              {catItems.map((item) => {
                const isActive = activeSlug === item.slug;
                return (
                  <button
                    key={item.slug}
                    onClick={() => {
                      onSelect(item.slug);
                      onCloseMobile?.();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-left group",
                      isActive
                        ? "bg-surface text-fg font-semibold shadow-xs"
                        : "text-muted hover:text-fg hover:bg-surface/60"
                    )}
                  >
                    <span className="truncate">{item.name}</span>

                    {item.badge && (
                      <span
                        className={cn(
                          "ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold tracking-tight",
                          item.badge === "new" && "bg-neon-lime text-black",
                          item.badge === "updated" && "bg-neon-magenta/20 text-pink-600 dark:text-neon-magenta border border-pink-500/30",
                          item.badge === "pro" && "bg-amber-400 text-black"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="px-3 py-8 text-center text-xs text-muted">
            No components match "{filterQuery}"
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="pt-4 border-t border-border/60 px-2 flex items-center justify-between text-[11px] font-mono text-muted">
        <span>{items.length} Primitives</span>
        <span className="text-neon-lime font-bold">● v2.4</span>
      </div>
    </aside>
  );
}
