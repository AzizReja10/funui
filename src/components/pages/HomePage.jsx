import { useState } from "react";
import { ArrowRight, Sparkles, Terminal, Copy, Check, Shield, Zap, Layers, Code2, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Switch } from "../ui/Switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";

export function HomePage({ onNavigate }) {
  const [copiedCli, setCopiedCli] = useState(false);
  const [demoSwitch, setDemoSwitch] = useState(true);

  function handleCopyCli() {
    navigator.clipboard.writeText("npx funui init");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  }

  return (
    <div className="w-full space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neon-lime/20 text-[#6d8a00] dark:text-neon-lime border border-neon-lime/30">
            <Sparkles size={13} className="text-neon-lime" />
            <span>FUNUI 2.0</span>
          </span>
          <span className="text-xs text-muted font-mono">• Production-ready React & Tailwind primitives</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-fg leading-[1.08] max-w-3xl">
          Craft visually stunning web interfaces with{" "}
          <span className="bg-gradient-to-r from-fg via-fg/80 to-muted bg-clip-text text-transparent">
            copy-and-paste speed.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          A curated collection of accessible, tactile React + Tailwind CSS primitives. No heavy npm package lock-in — just copy the code into your project, customize freely, and ship.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <Button
            variant="default"
            size="lg"
            onClick={() => onNavigate("button")}
            className="gap-2 group shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Browse Components</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate("installation")}
            className="cursor-pointer"
          >
            Installation Guide
          </Button>

          <button
            onClick={handleCopyCli}
            className="inline-flex items-center gap-2.5 h-11 px-4 text-xs font-mono rounded-lg border border-border bg-surface hover:bg-surface-hover text-fg transition-all cursor-pointer shadow-2xs"
          >
            <Terminal size={14} className="text-muted" />
            <span>npx funui init</span>
            {copiedCli ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-muted" />}
          </button>
        </div>
      </section>

      {/* Editorial Founder Note Section (inspired by Native Bloom) */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface/50 p-6 sm:p-10 transition-colors">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-muted mb-4">
          From The Creator
        </div>

        <blockquote className="font-serif text-lg sm:text-2xl text-fg/90 leading-relaxed max-w-3xl">
          “I review UI daily and still lose patterns. X and browser bookmarks pile up — still no help.
          GitHub: clone, run the example, hope there's a preview. Step away from the community and you fall behind fast.{" "}
          <strong className="font-semibold text-fg">FunUI is the living catalog I wished I had</strong> — every component interactive, copy-paste ready, styled for modern design.”
        </blockquote>

        <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/60">
          <div className="h-9 w-9 rounded-full bg-fg text-bg font-heading font-bold text-xs flex items-center justify-center shadow-xs">
            AR
          </div>
          <div>
            <div className="text-sm font-semibold text-fg font-heading">Aziz Reja</div>
            <div className="text-xs text-muted font-mono">Creator of FunUI</div>
          </div>
        </div>
      </section>

      {/* Interactive Showcase Preview Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-fg">Interactive Primitives</h2>
            <p className="text-sm text-muted mt-1">Test the live micro-interactions directly in your browser.</p>
          </div>
          <button
            onClick={() => onNavigate("button")}
            className="text-xs font-medium text-muted hover:text-fg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View all components</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Button preview */}
          <div
            onClick={() => onNavigate("button")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-medium text-muted uppercase">01 / Button</span>
              <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 py-4">
              <Button variant="default" size="sm">Default</Button>
              <Button variant="accent" size="sm">Electric Lime</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
            </div>
            <p className="text-xs text-muted mt-2">Six tactile variants with micro-interactions and active scale feedback.</p>
          </div>

          {/* Card 2: Switch preview */}
          <div
            onClick={() => onNavigate("switch")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-medium text-muted uppercase">02 / Switch</span>
              <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="py-4 flex items-center gap-3">
              <Switch checked={demoSwitch} onChange={setDemoSwitch} />
              <span className="text-sm font-medium text-fg">
                {demoSwitch ? "Live updates enabled" : "Updates paused"}
              </span>
            </div>
            <p className="text-xs text-muted mt-2">Accessible boolean toggle with smooth animated thumb glide.</p>
          </div>

          {/* Card 3: Badge preview */}
          <div
            onClick={() => onNavigate("badge")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-medium text-muted uppercase">03 / Badge</span>
              <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 py-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="lime">Lime Accent</Badge>
              <Badge variant="updated">Updated 2.4</Badge>
              <Badge variant="blue">New Release</Badge>
            </div>
            <p className="text-xs text-muted mt-2">Compact status labels in four weights and accent palettes.</p>
          </div>

          {/* Card 4: Hero Color Panels */}
          <div
            onClick={() => onNavigate("hero-color-panels")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-medium text-muted uppercase">04 / Hero Shader</span>
              <Badge variant="lime" size="xs">Flagship</Badge>
            </div>
            <div className="py-3 flex items-center gap-2">
              <div className="h-6 w-20 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-400" />
              <div className="h-6 w-16 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500" />
              <div className="h-6 w-16 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600" />
            </div>
            <p className="text-xs text-muted mt-2">Split-layout hero section with responsive ColorPanels shader visuals.</p>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border">
        <div>
          <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-fg mb-3 border border-border">
            <Zap size={16} />
          </div>
          <h3 className="font-heading text-sm font-semibold text-fg">Zero Runtime Lock-in</h3>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            All components are pure React + Tailwind CSS. Copy into your project and own the code.
          </p>
        </div>

        <div>
          <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-fg mb-3 border border-border">
            <Shield size={16} />
          </div>
          <h3 className="font-heading text-sm font-semibold text-fg">Accessible by Default</h3>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Built with ARIA standards, focus rings, keyboard navigability, and high-contrast support.
          </p>
        </div>

        <div>
          <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-fg mb-3 border border-border">
            <Layers size={16} />
          </div>
          <h3 className="font-heading text-sm font-semibold text-fg">Dark Mode Native</h3>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Pre-configured with modern CSS variables for seamless light and dark mode switching.
          </p>
        </div>
      </section>
    </div>
  );
}
