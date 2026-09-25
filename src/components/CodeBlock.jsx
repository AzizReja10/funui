import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "../lib/cn";
import { HighlightedCode } from "../lib/highlight";

export function CodeBlock({ code, title = "React / Tailwind", isCommand = false, className }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-[#FAF9F5] dark:bg-[#121215] text-fg shadow-2xs transition-colors",
        className
      )}
    >
      {/* Code Header Bar aligned with website surface */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-surface/50 dark:bg-surface/20">
        <div className="flex items-center gap-2">
          {isCommand ? (
            <Terminal size={13} className="text-neon-lime" />
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </div>
          )}
          <span className="text-[11px] font-mono text-muted font-medium ml-1">
            {title}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex h-6.5 items-center gap-1.5 rounded-md px-2 border border-border bg-bg hover:bg-surface text-[11px] font-mono text-muted hover:text-fg transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with syntax highlighting matching reference image */}
      <pre className="overflow-x-auto p-4 sm:p-5 text-[13px] leading-relaxed font-mono">
        <HighlightedCode code={code} />
      </pre>
    </div>
  );
}