import { cn } from "../../lib/cn";

const variants = {
  default: "bg-fg text-bg font-medium",
  outline: "border border-border text-fg bg-transparent",
  accent: "bg-neon-lime text-black font-semibold shadow-xs",
  lime: "bg-neon-lime/20 text-[#6d8a00] dark:text-neon-lime border border-neon-lime/40 font-semibold",
  updated: "bg-neon-magenta/15 text-pink-600 dark:text-neon-magenta border border-pink-500/30 font-semibold",
  blue: "bg-neon-blue/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-semibold",
  muted: "bg-surface text-muted border border-border/70",
};

export function Badge({ variant = "default", size = "sm", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wider transition-colors",
        variants[variant],
        size === "xs" && "px-1.5 py-0.2 text-[9px]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}