import { useState, useMemo } from "react";
import { Home, Terminal } from "lucide-react";
import { cn } from "../../lib/cn";
import { SearchInput } from "../ui/SearchInput";
import { getUrlForSlug } from "../../lib/routes";

const gettingStartedItems = [
  { slug: "home", name: "Home", category: "Getting Started", icon: Home },
  { slug: "installation", name: "Installation Guide", category: "Getting Started", icon: Terminal, badge: "guide" },
];

export function Sidebar({ items, activeSlug, onSelect, onCloseMobile, isDark, onToggleTheme }) {
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

  const filteredGettingStarted = useMemo(() => {
    if (!filterQuery.trim()) return gettingStartedItems;
    const q = filterQuery.toLowerCase();
    return gettingStartedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [filterQuery]);

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
    <aside className="w-64 xl:w-72 shrink-0 border-r border-border/80 py-4 pr-6 pl-1 flex flex-col h-[calc(100vh-6rem)] sticky top-20 overflow-y-auto">
      {/* Quick sidebar filter */}
      <div className="mb-5 px-1">
        <SearchInput
          fullWidth
          placeholder="Filter components or docs..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          onClear={() => setFilterQuery("")}
        />
      </div>

      {/* Categorized List */}
      <div className="flex-1 space-y-6">
        {/* Getting Started Section */}
        {filteredGettingStarted.length > 0 && (
          <div className="space-y-1">
            <h4 className="px-2.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted">
              Getting Started
            </h4>
            <div className="pt-1 space-y-0.5">
              {filteredGettingStarted.map((item) => {
                const isActive = activeSlug === item.slug;
                const Icon = item.icon;
                return (
                  <a
                    key={item.slug}
                    href={getUrlForSlug(item.slug)}
                    onClick={(e) => {
                      e.preventDefault();
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
                    <div className="flex items-center gap-2 truncate">
                      <Icon size={14} className={isActive ? "text-neon-lime" : "text-muted group-hover:text-fg"} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold tracking-tight bg-surface border border-border text-muted">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Component Categories */}
        {Object.entries(categories).map(([categoryName, catItems]) => (
          <div key={categoryName} className="space-y-1">
            <h4 className="px-2.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted">
              {categoryName}
            </h4>

            <div className="pt-1 space-y-0.5">
              {catItems.map((item) => {
                const isActive = activeSlug === item.slug;
                return (
                  <a
                    key={item.slug}
                    href={getUrlForSlug(item.slug)}
                    onClick={(e) => {
                      e.preventDefault();
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
                          (item.badge === "new" || item.badge === "fun") && "bg-neon-lime text-black",
                          item.badge === "updated" && "bg-neon-magenta/20 text-pink-600 dark:text-neon-magenta border border-pink-500/30",
                          (item.badge === "pro" || item.badge === "bite") && "bg-amber-400 text-black",
                          !["new", "fun", "updated", "pro", "bite"].includes(item.badge) && "bg-surface border border-border text-muted"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && filteredGettingStarted.length === 0 && (
          <div className="px-3 py-8 text-center text-xs text-muted">
            No components match "{filterQuery}"
          </div>
        )}
      </div>

      {/* Footer stats & Theme Toggle */}
      <div className="pt-4 border-t border-border/60 px-2 flex items-center justify-between text-[11px] font-mono text-muted">
        <span>{items.length} Primitives</span>
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-surface hover:bg-surface-hover text-fg transition-colors cursor-pointer"
            title="Toggle theme"
          >
            <span>{isDark ? "Dark" : "Light"}</span>
          </button>
        )}
      </div>
    </aside>
  );
}
