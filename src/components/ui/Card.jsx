import { cn } from "../../lib/cn";

export function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg p-6 transition-all duration-200 shadow-xs",
        hover && "hover:border-fg/20 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("font-heading text-lg font-semibold tracking-tight text-fg", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return <p className={cn("text-sm text-muted leading-relaxed", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn("text-sm text-fg/80", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return <div className={cn("mt-4 flex items-center pt-3 border-t border-border/60", className)} {...props}>{children}</div>;
}