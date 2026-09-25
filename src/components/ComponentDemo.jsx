import { useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { cn } from "../lib/cn";
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
  Terminal,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "./ui/Badge";

export function ComponentDemo({ item, onPrev, onNext, hasPrev, hasNext }) {
  const [tab, setTab] = useState("preview"); // 'preview' | 'code' | 'props'
  const [viewport, setViewport] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [copiedPage, setCopiedPage] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  async function handleCopyPage() {
    await navigator.clipboard.writeText(item.code);
    setCopiedPage(true);
    setTimeout(() => setCopiedPage(false), 2000);
  }

  async function handleCopyInstall() {
    await navigator.clipboard.writeText(item.installation || `npx funui add ${item.slug}`);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  }

  return (
    <article id={item.slug} className="scroll-mt-20">
      {/* Category Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted mb-2">
        <span>Docs</span>
        <span>/</span>
        <span>Components</span>
        <span>/</span>
        <span className="text-fg font-medium">{item.category}</span>
      </div>

      {/* Title & Navigation Header (inspired by screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
            {item.name}
          </h1>
          {item.badge && (
            <Badge
              variant={
                item.badge === "new" || item.badge === "fun"
                  ? "lime"
                  : item.badge === "updated"
                  ? "updated"
                  : "default"
              }
            >
              {item.badge}
            </Badge>
          )}
        </div>

        {/* Right Action buttons: Copy Page + Prev/Next */}
        <div className="flex items-center gap-2">
          {/* Copy Page dropdown/button */}
          <button
            onClick={handleCopyPage}
            className="inline-flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-fg shadow-xs transition-all cursor-pointer"
          >
            {copiedPage ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copiedPage ? "Copied" : "Copy Page"}</span>
            <ChevronDown size={12} className="text-muted" />
          </button>

          {/* Navigation Arrows */}
          <div className="flex items-center rounded-lg border border-border bg-surface shadow-xs overflow-hidden">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="p-1.5 hover:bg-surface-hover text-muted hover:text-fg disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous component"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="w-[1px] h-4 bg-border" />
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="p-1.5 hover:bg-surface-hover text-muted hover:text-fg disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Next component"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Description Subtitle */}
      <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
        {item.description}
      </p>

      {/* Feature tags */}
      {item.tags && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-surface border border-border/80 text-[11px] font-mono text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Tab Switcher & Viewport Toggles Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        {/* Left: Preview / Code / Props pills */}
        <div className="inline-flex items-center p-1 rounded-xl bg-surface border border-border">
          {[
            { id: "preview", label: "Preview" },
            { id: "code", label: "Code" },
            { id: "props", label: "Props & API" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-3.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer",
                tab === t.id
                  ? "bg-bg text-fg font-semibold shadow-xs"
                  : "text-muted hover:text-fg hover:bg-surface-hover"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right: Viewport Resizer (Only in Preview mode) */}
        {tab === "preview" && (
          <div className="hidden sm:inline-flex items-center p-0.5 rounded-lg bg-surface border border-border">
            <button
              onClick={() => setViewport("desktop")}
              className={cn(
                "p-1.5 rounded-md text-xs transition-colors",
                viewport === "desktop" ? "bg-bg text-fg shadow-xs" : "text-muted hover:text-fg"
              )}
              title="Desktop viewport (100%)"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={cn(
                "p-1.5 rounded-md text-xs transition-colors",
                viewport === "tablet" ? "bg-bg text-fg shadow-xs" : "text-muted hover:text-fg"
              )}
              title="Tablet viewport (768px)"
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={cn(
                "p-1.5 rounded-md text-xs transition-colors",
                viewport === "mobile" ? "bg-bg text-fg shadow-xs" : "text-muted hover:text-fg"
              )}
              title="Mobile viewport (375px)"
            >
              <Smartphone size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="mt-5">
        {tab === "preview" && (
          <div className="flex flex-col gap-8">
            {/* Viewport Frame */}
            <div className="w-full flex justify-center">
              <div
                className={cn(
                  "w-full transition-all duration-300",
                  viewport === "tablet" && "max-w-[768px]",
                  viewport === "mobile" && "max-w-[375px]"
                )}
              >
                <div className="relative rounded-2xl border border-border bg-dot-grid bg-bg p-4 sm:p-8 flex items-center justify-center min-h-[300px] shadow-xs overflow-hidden">
                  {item.demo}
                </div>
              </div>
            </div>

            {/* Quick Installation Section */}
            <div id="installation" className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold uppercase tracking-wider text-fg">
                  Installation
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 font-mono text-xs text-fg">
                <div className="flex items-center gap-2.5 truncate">
                  <Terminal size={14} className="text-neon-lime shrink-0" />
                  <span className="truncate">{item.installation || `bunx forma-ui add ${item.slug}`}</span>
                </div>
                <button
                  onClick={handleCopyInstall}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors shrink-0 ml-3"
                >
                  {copiedInstall ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Usage Code Snippet */}
            <div id="usage" className="space-y-3">
              <span className="font-heading text-sm font-bold uppercase tracking-wider text-fg">
                Usage
              </span>
              <CodeBlock code={item.code} title={`${item.name}.jsx`} />
            </div>
          </div>
        )}

        {tab === "code" && (
          <div className="space-y-6">
            <CodeBlock code={item.code} title={`${item.name}.jsx`} />
          </div>
        )}

        {tab === "props" && (
          <div id="props" className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden bg-bg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-surface/70 font-mono text-muted uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Prop</th>
                      <th className="py-3 px-4 font-semibold">Type</th>
                      <th className="py-3 px-4 font-semibold">Default</th>
                      <th className="py-3 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {item.props?.map((p) => (
                      <tr key={p.name} className="hover:bg-surface/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-fg">{p.name}</td>
                        <td className="py-3 px-4 font-mono text-muted">{p.type}</td>
                        <td className="py-3 px-4 font-mono text-neon-blue dark:text-blue-400">
                          {p.default}
                        </td>
                        <td className="py-3 px-4 text-muted">{p.description}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-muted">
                          Standard HTML & React props supported.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}