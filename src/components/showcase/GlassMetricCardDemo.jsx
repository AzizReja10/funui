import { useState } from "react";
import { TrendingUp, Users, ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { Badge } from "../ui/Badge";

export function GlassMetricCardDemo() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-6 p-4">
      {/* Metric Card 1 */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full max-w-xs relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface via-bg to-surface p-6 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime/10 rounded-full blur-2xl" />
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted uppercase tracking-wider">Revenue Rate</span>
          <Badge variant="lime" size="xs">+24.8%</Badge>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-heading text-3xl font-extrabold text-fg">$128,420</span>
          <span className="text-xs text-muted font-mono">USD</span>
        </div>

        {/* Sparkline visualization */}
        <div className="mt-5 flex items-end gap-1.5 h-12 pt-2 border-b border-border/50 pb-1">
          {[35, 45, 30, 60, 50, 75, 65, 90, 85, 100].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-300 ${
                i === 9 ? "bg-neon-lime" : "bg-fg/15 hover:bg-fg/30"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>Target: $150k</span>
          <span className="font-semibold text-fg">85.6% reached</span>
        </div>
      </div>

      {/* Metric Card 2 */}
      <div className="w-full max-w-xs relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface via-bg to-surface p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-magenta/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted uppercase tracking-wider">Active Users</span>
          <Badge variant="updated" size="xs">Live Now</Badge>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-heading text-3xl font-extrabold text-fg">14,290</span>
          <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
            <TrendingUp size={13} /> +12.4%
          </span>
        </div>

        {/* Sparkline visualization */}
        <div className="mt-5 flex items-end gap-1.5 h-12 pt-2 border-b border-border/50 pb-1">
          {[20, 30, 45, 40, 55, 65, 60, 70, 80, 95].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-300 ${
                i === 9 ? "bg-neon-magenta" : "bg-fg/15 hover:bg-fg/30"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>Global latency</span>
          <span className="font-semibold text-fg">18ms average</span>
        </div>
      </div>
    </div>
  );
}
