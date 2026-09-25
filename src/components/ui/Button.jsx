import { cn } from "../../lib/cn";

const variants = {
  default: "bg-fg text-bg hover:opacity-90 active:scale-[0.98]",
  outline: "border border-border bg-transparent text-fg hover:bg-surface active:scale-[0.98]",
  ghost: "bg-transparent text-fg hover:bg-surface active:scale-[0.98]",
  accent: "bg-neon-lime text-black font-semibold hover:brightness-95 shadow-glow-lime/40 shadow-sm active:scale-[0.98]",
  primary: "bg-neon-blue text-white font-medium hover:bg-blue-600 shadow-glow-blue/30 shadow-sm active:scale-[0.98]",
  destructive: "bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98]",
  jelly: "btn-jelly text-white font-semibold shadow-md",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-sm font-medium",
  icon: "h-9 w-9 p-0",
};

export function Button({ variant = "default", size = "md", className, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer select-none",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { BiteButton } from "./BiteButton";