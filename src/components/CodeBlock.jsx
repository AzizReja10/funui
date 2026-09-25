import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "../lib/cn";

export function CodeBlock({ code, title = "React / Tailwind", isCommand = false, className }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-border bg-[#0d0d11] text-white shadow-md", className)}>
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {isCommand ? (
            <Terminal size={13} className="text-neon-lime" />
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500/80" />
              <span className="h-2 w-2 rounded-full bg-amber-500/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
            </div>
          )}
          <span className="text-[11px] font-mono text-zinc-400 font-medium ml-1">
            {title}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex h-6.5 items-center gap-1.5 rounded-md px-2 border border-white/10 bg-white/5 text-[11px] font-mono text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono selection:bg-neon-lime selection:text-black">
        <code className="text-zinc-200">{code}</code>
      </pre>
    </div>
  );
}