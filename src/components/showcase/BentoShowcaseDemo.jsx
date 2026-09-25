import { useState } from "react";
import { Sparkles, Activity, ShieldCheck, Zap, ArrowUpRight, BarChart3 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function BentoShowcaseDemo() {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
      {/* Large Featured Tile */}
      <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between group hover:border-fg/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <Badge variant="lime">Interactive Primitive</Badge>
            <span className="text-xs font-mono text-muted">BENTO_01</span>
          </div>
          <h3 className="mt-4 font-heading text-xl font-bold text-fg">
            Realtime Streaming Engine
          </h3>
          <p className="mt-2 text-sm text-muted max-w-md">
            Built-in server-sent event parser with automatic reconnects and visual token highlighting.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between pt-4 border-t border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-bg border border-border flex items-center justify-center text-neon-lime">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-fg">99.98% Latency SLA</div>
              <div className="text-[11px] text-muted">&lt; 12ms token TTFT</div>
            </div>
          </div>
          <ArrowUpRight size={18} className="text-muted group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Small Stat Tile 1 */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between group hover:border-fg/30 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between">
            <Badge variant="updated">New 2.4</Badge>
            <ShieldCheck size={16} className="text-muted" />
          </div>
          <h4 className="mt-4 font-heading text-lg font-semibold text-fg">Zero-Copy Runtime</h4>
          <p className="mt-1 text-xs text-muted">Direct DOM injection without hydration overhead.</p>
        </div>
        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-heading text-3xl font-extrabold text-fg">0.4kb</span>
          <span className="text-xs text-emerald-500 font-semibold">gzipped</span>
        </div>
      </div>

      {/* Small Stat Tile 2 */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between group hover:border-fg/30 transition-all duration-300">
        <div className="flex items-center justify-between">
          <Badge variant="blue">Telemetry</Badge>
          <Activity size={16} className="text-blue-500 animate-pulse" />
        </div>
        <div className="my-3">
          <div className="font-heading text-2xl font-bold text-fg">2.4M+</div>
          <div className="text-xs text-muted">Weekly component imports</div>
        </div>
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <div className="h-full bg-neon-blue rounded-full w-[82%]" />
        </div>
      </div>

      {/* Wide Tile */}
      <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-fg/30 transition-all duration-300">
        <div>
          <div className="text-xs font-mono text-muted uppercase tracking-wider">Universal Primitives</div>
          <div className="mt-1 font-heading text-base font-semibold text-fg">Works across Next.js, Vite, Remix & Astro</div>
          <p className="mt-1 text-xs text-muted">Every component is pure React + Tailwind with zero runtime lock-in.</p>
        </div>
        <Button variant="default" size="sm" className="whitespace-nowrap">
          Explore Bento Grid
        </Button>
      </div>
    </div>
  );
}
