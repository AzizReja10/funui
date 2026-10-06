import { useState } from "react";
import { ArrowRight, Sparkles, Terminal, Copy, Check, Shield, Zap, Layers, ArrowUpRight, Globe, Calendar, Smartphone } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Switch } from "../ui/Switch";

export function HomePage({ onNavigate }) {
  const [copiedCli, setCopiedCli] = useState(false);
  const [demoSwitch, setDemoSwitch] = useState(true);

  function handleCopyCli() {
    navigator.clipboard.writeText("npx shadcn@latest init");
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
          A curated collection of accessible, tactile React + Tailwind CSS primitives built for shadcn/ui. No heavy npm package lock-in — just copy the code into your project, customize freely, and ship.
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
            <span>npx shadcn@latest init</span>
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
            <p className="text-xs text-muted mt-2">Split-layout hero section with responsive 3D ColorPanels visual.</p>
          </div>

          {/* Card 5: Windows Timeline */}
          <div
            onClick={() => onNavigate("windows-timeline")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium text-muted uppercase">05 / Windows Timeline</span>
              <div className="flex items-center gap-2">
                <Badge variant="lime" size="xs">New</Badge>
                <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                  Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
            <div className="py-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-[#0078d4] text-white text-[11px] font-semibold flex items-center gap-2 shadow-xs">
                  <span>Windows Evolution</span>
                </div>
                <span className="text-[10px] font-mono text-muted hidden sm:inline">1985–2021</span>
              </div>
              <div className="flex items-center gap-1.5 h-6 relative w-20">
                <div className="absolute inset-x-0 flex justify-between">
                  <span className="w-px h-2.5 bg-border rounded-full" />
                  <span className="w-px h-2.5 bg-border rounded-full" />
                  <span className="w-px h-2.5 bg-border rounded-full" />
                  <span className="w-px h-2.5 bg-border rounded-full" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-4 bg-fg rounded-full" />
              </div>
            </div>
            <p className="text-xs text-muted mt-2">Continuous drag scrubber slider featuring floating logo marks, rolling odometer year, spring-snap release, and arrow-key accessibility.</p>
          </div>

          {/* Card 6: Realistic Globe */}
          <div
            onClick={() => onNavigate("realistic-globe")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium text-muted uppercase">06 / Realistic Globe</span>
              <div className="flex items-center gap-2">
                <Badge variant="lime" size="xs">Flagship 3D</Badge>
                <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                  Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
            <div className="py-2 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 via-emerald-500 to-amber-400 flex items-center justify-center text-white text-xs shadow-md shadow-blue-500/20">
                  <Globe size={14} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-fg">Satellite Earth</span>
                  <div className="text-[10px] font-mono text-muted">NASA Textures • Relief Map • Zoom In</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">Three.js</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">Fly-To Zoom</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">Photorealistic NASA satellite Earth globe with topographic relief, specular ocean reflections, drifting cloud deck, and interactive zoom fly-in effects.</p>
          </div>

          {/* Card 7: Liquid Orb 3D */}
          <div
            onClick={() => onNavigate("liquid-orb")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium text-muted uppercase">07 / Liquid Orb 3D</span>
              <div className="flex items-center gap-2">
                <Badge variant="lime" size="xs">Creative</Badge>
                <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                  Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
            <div className="py-2 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 via-sky-400 to-neon-lime flex items-center justify-center text-black text-xs shadow-md shadow-purple-500/20">
                  <Sparkles size={14} className="text-black" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-fg">Fluid Mesh & Jello Squish</span>
                  <div className="text-[10px] font-mono text-muted">0 KB Textures • Harmonic Waves • PBR Presets</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neon-lime/10 text-[#6d8a00] dark:text-neon-lime border border-neon-lime/30">Three.js</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Chrome PBR</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">Lightweight procedural fluid sculpture with organic harmonic ripples, spring squish physics, mouse tilt, and 5 PBR materials.</p>
          </div>

          {/* Card 8: Seasonal Calendar */}
          <div
            onClick={() => onNavigate("seasonal-calendar")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium text-muted uppercase">08 / Seasonal Calendar</span>
              <div className="flex items-center gap-2">
                <Badge variant="lime" size="xs">New</Badge>
                <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                  Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
            <div className="py-2 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 via-pink-400 to-amber-400 flex items-center justify-center text-white text-xs shadow-md shadow-pink-500/20">
                  <Calendar size={14} className="text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-fg">Atmospheric Seasonal Calendar</span>
                  <div className="text-[10px] font-mono text-muted">4 Seasons • Procedural Particles • 3D Month Flip</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">Framer Motion</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Dynamic Sky</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">Atmospheric calendar with season-specific colorways, drifting particles (snow, petals, autumn leaves), 3D flip page physics, and rolling hill silhouettes.</p>
          </div>

          {/* Card 9: Pay Flow (UPI) */}
          <div
            onClick={() => onNavigate("pay-flow")}
            className="rounded-2xl border border-border bg-bg p-6 hover:border-fg/30 transition-all cursor-pointer group shadow-2xs md:col-span-2"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium text-muted uppercase">09 / Pay Flow (UPI)</span>
              <div className="flex items-center gap-2">
                <Badge variant="lime" size="xs">New</Badge>
                <span className="text-xs font-medium text-muted group-hover:text-fg flex items-center gap-1 transition-colors">
                  Inspect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
            <div className="py-2 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 via-emerald-500 to-amber-300 flex items-center justify-center text-white text-xs shadow-md shadow-blue-500/20">
                  <Smartphone size={14} className="text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-fg">Tactile UPI Payment Flow</span>
                  <div className="text-[10px] font-mono text-muted">6-Digit PIN Keypad • Toppling Domino Physics • Sound Synthesis • Settlement Screen</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Domino Loader</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Sound Box</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Micro-Interactions</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">Authentic smartphone UPI payment flow featuring interactive PIN entry with key flashes, physics-based domino loader, procedural Web Audio victory chime, and spring settlement screen.</p>
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
