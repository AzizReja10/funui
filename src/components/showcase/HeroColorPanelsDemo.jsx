import { useState } from "react";
import { ArrowRight, Sparkles, Terminal, Copy, Check, Layers, Cpu, Code2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function HeroColorPanelsDemo() {
  const [fanned, setFanned] = useState(false);
  const [activeTab, setActiveTab] = useState("agents");
  const [copied, setCopied] = useState(false);

  const panels = [
    {
      gradient: "from-lime-400/80 via-emerald-400/60 to-teal-500/80",
      border: "border-lime-300/60",
      glow: "shadow-[0_0_30px_rgba(163,230,53,0.3)]",
      offset: "0px",
      z: 50,
      label: "Agent Runtime",
    },
    {
      gradient: "from-cyan-400/80 via-blue-500/60 to-indigo-600/80",
      border: "border-cyan-300/60",
      glow: "shadow-[0_0_30px_rgba(34,211,238,0.3)]",
      offset: "18px",
      z: 40,
      label: "Tool Call Engine",
    },
    {
      gradient: "from-pink-500/80 via-rose-500/60 to-purple-600/80",
      border: "border-pink-300/60",
      glow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]",
      offset: "36px",
      z: 30,
      label: "Workflow Graph",
    },
    {
      gradient: "from-purple-500/80 via-fuchsia-500/60 to-amber-500/80",
      border: "border-purple-300/60",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
      offset: "54px",
      z: 20,
      label: "Artifact Stream",
    },
  ];

  function handleCopy() {
    navigator.clipboard.writeText("npx forma-ui add hero-color-panels");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface via-bg to-surface p-6 sm:p-10 transition-all duration-300">
      {/* Decorative top label */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neon-lime animate-pulse" />
          <span className="text-xs font-mono font-medium text-muted tracking-wide uppercase">Default Layout</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFanned(!fanned)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border border-border bg-surface text-fg hover:bg-surface-hover transition-colors"
          >
            <Layers size={13} />
            <span>{fanned ? "Collapse Panels" : "Expand 3D Depth"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Headline and CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-neon-lime text-black shadow-xs">
              <Sparkles size={12} className="animate-spin text-black" style={{ animationDuration: "6s" }} />
              AI SDK Agents
            </span>
            <span className="text-xs text-muted font-mono">v2.4.0 • Copy & Paste</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-[1.08]">
            AI SDK Agents <br />
            <span className="bg-gradient-to-r from-fg via-fg/90 to-fg/60 bg-clip-text text-transparent">
              Copy and Paste
            </span>
          </h2>

          <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed">
            Full-stack Vercel AI SDK patterns for workflows, tool calling, and agent orchestration.
            Fully responsive ColorPanels shader visuals with zero external CSS dependencies.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="default"
              size="lg"
              className="gap-2 group shadow-lg hover:shadow-xl"
            >
              <span>Browse Agents</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 h-11 px-4 text-xs font-mono rounded-lg border border-border bg-surface text-fg hover:bg-surface-hover hover:border-fg/30 transition-all cursor-pointer"
            >
              <Terminal size={14} className="text-muted" />
              <span>bunx forma add hero</span>
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-muted" />}
            </button>
          </div>

          {/* Tech Stack Badges */}
          <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-border/50 text-xs text-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Built for:</span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-[11px] font-medium text-fg">Next.js 15</span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-[11px] font-medium text-fg">Vercel AI</span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-[11px] font-medium text-fg">Tailwind 3.4</span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-[11px] font-medium text-fg">TypeScript</span>
          </div>
        </div>

        {/* Right Column: 3D Layered Color Panels Shader Graphic */}
        <div className="lg:col-span-5 flex items-center justify-center py-6">
          <div
            className="relative w-full max-w-[340px] h-[300px] flex items-center justify-center cursor-pointer select-none perspective-[1000px]"
            onClick={() => setFanned(!fanned)}
            onMouseEnter={() => setFanned(true)}
            onMouseLeave={() => setFanned(false)}
          >
            {/* Ambient background glow behind the stacked deck */}
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/20 via-cyan-400/20 to-pink-500/20 rounded-full blur-3xl opacity-60 animate-pulse-subtle" />

            {/* Layered Color Panels deck */}
            <div
              className="relative w-64 h-48 transition-all duration-700 ease-out"
              style={{
                transform: fanned
                  ? "rotateX(20deg) rotateY(-35deg) rotateZ(8deg) scale(1.05)"
                  : "rotateX(15deg) rotateY(-25deg) rotateZ(5deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {panels.map((panel, idx) => {
                const step = idx * (fanned ? 36 : 14);
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 rounded-2xl border ${panel.border} bg-gradient-to-tr ${panel.gradient} backdrop-blur-md transition-all duration-700 ease-out flex flex-col justify-between p-4 ${panel.glow}`}
                    style={{
                      transform: `translate3d(${step}px, ${-step * 0.75}px, ${step * 2}px)`,
                      zIndex: panel.z,
                      opacity: 0.88 - idx * 0.08,
                    }}
                  >
                    {/* Panel header decoration */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-white/80 shadow-xs" />
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/90 font-semibold drop-shadow-xs">
                          {panel.label}
                        </span>
                      </div>
                      <Cpu size={14} className="text-white/80" />
                    </div>

                    {/* Subtle panel inner lines */}
                    <div className="space-y-1.5 my-auto opacity-75">
                      <div className="h-1 w-24 bg-white/40 rounded-full" />
                      <div className="h-1 w-16 bg-white/30 rounded-full" />
                    </div>

                    {/* Panel footer badge */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-white/80">
                      <span>PANEL_0{idx + 1}</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/20 backdrop-blur-xs font-semibold">
                        active
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Floating micro card in front of panels */}
              <div
                className="absolute -bottom-6 -left-6 rounded-xl border border-white/40 bg-bg/90 backdrop-blur-xl p-3 shadow-xl transition-all duration-700 ease-out z-[90]"
                style={{
                  transform: fanned
                    ? "translate3d(-20px, 20px, 120px)"
                    : "translate3d(0px, 0px, 60px)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-neon-lime/20 flex items-center justify-center text-[#6d8a00] dark:text-neon-lime">
                    <Code2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-fg">100+ Agent Patterns</div>
                    <div className="text-[10px] text-muted">Zero lock-in runtime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
