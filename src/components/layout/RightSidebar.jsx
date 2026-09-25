import { Bot, Sparkles, ArrowRight, Layers, Workflow, Wrench, Shield, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/Badge";

export function RightSidebar({ activeSlug, onSelectComponent }) {
  return (
    <aside className="hidden xl:flex flex-col gap-6 w-64 shrink-0 py-6 pl-4 pr-1 text-xs sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto">
      {/* On this page TOC */}
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-fg">
          On this page
        </h4>
        <nav className="flex flex-col gap-1.5 text-muted border-l border-border pl-3">
          <a
            href="#overview"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-0.5 text-fg font-medium"
          >
            Overview
          </a>
          <a
            href="#preview"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-0.5"
          >
            Interactive Preview
          </a>
          <a
            href="#installation"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-0.5"
          >
            Installation
          </a>
          <a
            href="#usage"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-0.5"
          >
            Usage & Code
          </a>
          <a
            href="#props"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-0.5"
          >
            Props & API
          </a>
        </nav>
      </div>

      {/* Promo Card 1: AI SDK Agents / Full Stack AI Patterns */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-surface via-bg to-surface p-4 shadow-sm group">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neon-blue/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Bot size={11} />
            AI SDK AGENTS
          </span>
        </div>

        <h5 className="font-heading text-sm font-bold text-fg">
          Full Stack AI Patterns
        </h5>

        <ul className="mt-3 space-y-2 text-[11px] font-mono text-muted uppercase tracking-wider">
          <li className="flex items-center gap-2">
            <Layers size={13} className="text-blue-500 shrink-0" />
            <span>Complex AI Agents</span>
          </li>
          <li className="flex items-center gap-2">
            <Workflow size={13} className="text-blue-500 shrink-0" />
            <span>Workflow Patterns</span>
          </li>
          <li className="flex items-center gap-2">
            <Wrench size={13} className="text-blue-500 shrink-0" />
            <span>Tools + Artifacts</span>
          </li>
        </ul>

        <button
          onClick={() => onSelectComponent("hero-color-panels")}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-neon-blue hover:bg-blue-600 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
        >
          <span>BROWSE AGENTS</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Promo Card 2: Marketing UI / Cult Pro style */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface bg-tech-grid p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neon-magenta/15 text-pink-600 dark:text-neon-magenta border border-pink-500/20">
            <Sparkles size={11} />
            FORMA PRO
          </span>
        </div>

        <h5 className="font-heading text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
          Marketing UI
        </h5>

        <ul className="mt-3 space-y-2 text-[11px] font-mono text-muted uppercase tracking-wider">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-pink-500 shrink-0" />
            <span>125 Premium Blocks</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-pink-500 shrink-0" />
            <span>38 Components</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-pink-500 shrink-0" />
            <span>10 Starter Templates</span>
          </li>
        </ul>

        <button
          onClick={() => alert("Forma Pro gives you lifetime access to all premium blocks & templates.")}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs shadow-glow-magenta/30 shadow-xs transition-all cursor-pointer"
        >
          <span>GET CULT PRO</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </aside>
  );
}
