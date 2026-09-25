import { registry } from "../data/registry";
import { cn } from "../lib/cn";

export function Sidebar({ active, onSelect }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border px-4 py-8 md:block">
      <div className="mb-8 px-2">
        <span className="font-heading text-lg font-semibold text-fg">Forma</span>
        <span className="ml-1 font-heading text-lg font-semibold text-accent">UI</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted">Components</p>
        {registry.map((item) => (
          <button
            key={item.slug}
            onClick={() => onSelect(item.slug)}
            className={cn(
              "rounded-md px-2 py-1.5 text-left text-sm transition-colors",
              active === item.slug ? "bg-surface font-medium text-fg" : "text-muted hover:bg-surface hover:text-fg"
            )}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}