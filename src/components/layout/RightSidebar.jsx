import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function RightSidebar({ activeSlug, onSelectComponent }) {
  return (
    <aside className="hidden xl:flex flex-col gap-6 w-60 shrink-0 py-4 pl-4 pr-1 text-xs sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto">
      {/* On this page TOC */}
      <div className="flex flex-col gap-2.5">
        <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-fg">
          On this page
        </h4>
        <nav className="flex flex-col gap-1 text-muted border-l border-border pl-3">
          <a
            href="#overview"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-1 text-fg font-medium text-xs"
          >
            Overview
          </a>
          <a
            href="#preview"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-1 text-xs"
          >
            Interactive Preview
          </a>
          <a
            href="#installation"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-1 text-xs"
          >
            Installation
          </a>
          <a
            href="#usage"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-1 text-xs"
          >
            Usage & Code
          </a>
          <a
            href="#props"
            className="hover:text-fg hover:translate-x-0.5 transition-all py-1 text-xs"
          >
            Props & API
          </a>
        </nav>
      </div>

      {/* Refined Pro Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4.5 shadow-2xs mt-2">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-fg/10 text-fg">
            <Sparkles size={11} className="text-amber-500" />
            PRO ACCESS
          </span>
        </div>

        <h5 className="font-heading text-[15px] font-bold text-fg">
          FunUI Pro
        </h5>
        <p className="mt-1 text-[11px] text-muted leading-relaxed">
          Unlock 140+ premium block templates and full-stack MCP workflows.
        </p>

        <ul className="mt-3 space-y-1.5 text-[11px] text-muted">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>Production-ready code</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>Lifetime free updates</span>
          </li>
        </ul>

        <button
          onClick={() => alert("FunUI Pro: Full access to all components, blocks, and MCP tools.")}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-fg text-bg hover:opacity-90 font-medium text-xs shadow-xs transition-all cursor-pointer"
        >
          <span>Get All-Access</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </aside>
  );
}
