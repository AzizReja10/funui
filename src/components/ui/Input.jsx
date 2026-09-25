import { cn } from "../../lib/cn";

export function Input({ className, icon: Icon, ...props }) {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <span className="pointer-events-none absolute left-3 text-muted">
          <Icon size={16} />
        </span>
      )}
      <input
        className={cn(
          "h-9.5 w-full rounded-lg border border-border bg-bg px-3.5 text-sm text-fg placeholder:text-muted",
          "outline-none transition-all duration-150 focus:border-fg focus:ring-1 focus:ring-fg/20 shadow-xs",
          "disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-9",
          className
        )}
        {...props}
      />
    </div>
  );
}