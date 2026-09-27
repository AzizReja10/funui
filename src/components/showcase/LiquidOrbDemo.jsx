import { useState } from 'react';
import { LiquidOrb } from '../ui/LiquidOrb';
import { Sparkles, Activity, Layers, RotateCcw, Zap, Orbit, Radio, Magnet, Flame } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';

// Minimal drop-in usage example
export function LiquidOrbMinimalDemo() {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl border border-border bg-gradient-to-b from-surface/50 via-surface/20 to-bg overflow-hidden shadow-xs">
      <LiquidOrb shape="sphere" preset="chrome" speed={1.1} />
      <div className="pointer-events-none absolute bottom-3 inset-x-0 text-center text-[10px] font-mono text-muted">
        Click or drag to interact
      </div>
    </div>
  );
}

// Full interactive showcase with real-time material, animation layers & physics controls
export function LiquidOrbDemo() {
  const [shape, setShape] = useState('sphere');
  const [preset, setPreset] = useState('chrome');
  const [wireframe, setWireframe] = useState(false);
  const [showHalos, setShowHalos] = useState(true);
  const [showFireflies, setShowFireflies] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [magneticCursor, setMagneticCursor] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const [distortion, setDistortion] = useState(0.35);
  const [clickCount, setClickCount] = useState(0);
  const [orbKey, setOrbKey] = useState(0);

  const shapes = [
    { id: 'sphere', label: 'Fluid Blob', icon: '🌐' },
    { id: 'knot', label: 'Infinity Knot', icon: '♾️' },
    { id: 'crystal', label: 'Prism Crystal', icon: '💎' },
    { id: 'ring', label: 'Halo Ring', icon: '🪐' },
  ];

  const presets = [
    { id: 'chrome', label: 'Chrome', color: '#e2e8f0', border: '#94a3b8' },
    { id: 'iridescent', label: 'Prism', color: '#c084fc', border: '#a855f7' },
    { id: 'neon', label: 'Cyber Lime', color: '#d4f73c', border: '#84cc16' },
    { id: 'glass', label: 'Crystal', color: '#93c5fd', border: '#60a5fa' },
    { id: 'obsidian', label: 'Obsidian', color: '#f59e0b', border: '#d97706' },
  ];

  const resetAll = () => {
    setShape('sphere');
    setPreset('chrome');
    setWireframe(false);
    setShowHalos(true);
    setShowFireflies(true);
    setShowParticles(true);
    setMagneticCursor(true);
    setSpeed(1.0);
    setDistortion(0.35);
    setOrbKey((k) => k + 1);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-border bg-gradient-to-b from-surface/80 via-surface/40 to-bg backdrop-blur-sm overflow-hidden shadow-xl transition-all">
      {/* Top Header / Telemetry Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border/70 bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-neon-lime/10 border border-neon-lime/30 flex items-center justify-center text-[#6d8a00] dark:text-neon-lime">
            <Sparkles size={17} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold text-fg">Liquid Orb 3D</span>
              <Badge variant="lime" size="xs">Kinetic Physics</Badge>
            </div>
            <p className="text-[11px] text-muted font-mono">
              Quantum Halos • Dancing Fireflies • Stardust Swarm • Ferrofluid Gravity
            </p>
          </div>
        </div>

        {/* Action Quick Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe((w) => !w)}
            className={cn(
              "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer",
              wireframe
                ? "bg-neon-lime/20 border-neon-lime/40 text-fg font-semibold shadow-xs"
                : "border-border bg-bg/80 hover:bg-surface text-muted hover:text-fg"
            )}
            title="Toggle 3D wireframe polygon mesh"
          >
            <Layers size={13} />
            <span>Wireframe</span>
          </button>

          {/* Reset */}
          <button
            onClick={resetAll}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-bg/80 hover:bg-surface text-muted hover:text-fg transition-colors cursor-pointer"
            title="Reset default configuration"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main 3D Stage Box */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[520px] bg-gradient-to-b from-surface/30 via-bg to-surface/50 overflow-hidden select-none border-y border-border/70">
        {/* Subtle radial ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,247,60,0.06),transparent_70%)]" />

        {/* The 3D Liquid Orb Component */}
        <LiquidOrb
          key={orbKey}
          shape={shape}
          preset={preset}
          speed={speed}
          distortion={distortion}
          wireframe={wireframe}
          showHalos={showHalos}
          showFireflies={showFireflies}
          showParticles={showParticles}
          magneticCursor={magneticCursor}
          onClick={() => setClickCount((c) => c + 1)}
          className="relative z-10"
        />

        {/* Bottom Left: Interaction hints */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 dark:bg-zinc-900/90 border border-border shadow-xs backdrop-blur-md text-[11px] text-fg font-mono">
          <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
          <span>Magnetic cursor pull • Click to trigger shockwave</span>
        </div>

        {/* Bottom Right: Tactile Squish Counter Badge */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 dark:bg-zinc-900/90 border border-border shadow-xs backdrop-blur-md text-[11px] text-muted font-mono">
          <Activity size={12} className="text-neon-lime" />
          <span>Shockwaves: <strong className="text-fg">{clickCount}</strong></span>
        </div>
      </div>

      {/* Bottom Controls Deck */}
      <div className="relative z-10 p-4 sm:p-6 border-t border-border/70 bg-surface/30 flex flex-col gap-5">
        {/* Row 1: Shape Selector & Material Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Shape Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-medium text-muted mr-1">Shape:</span>
            <div className="inline-flex items-center p-1 rounded-xl bg-surface border border-border">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                    shape === s.id
                      ? "bg-bg text-fg font-semibold shadow-xs"
                      : "text-muted hover:text-fg hover:bg-surface-hover"
                  )}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Material Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-medium text-muted mr-1">Material:</span>
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border",
                    preset === p.id
                      ? "bg-bg text-fg border-border font-bold shadow-xs scale-105"
                      : "border-transparent text-muted hover:text-fg"
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-2xs shrink-0"
                    style={{ backgroundColor: p.color, border: `1px solid ${p.border}` }}
                  />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Creative Animation Layers Toggle Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs font-mono font-medium text-muted mr-1">Animations:</span>

          <button
            onClick={() => setShowHalos((h) => !h)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
              showHalos
                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 font-semibold"
                : "bg-surface text-muted border-border hover:text-fg"
            )}
            title="Toggle outer rotating gimbal halo rings"
          >
            <Orbit size={12} />
            <span>Quantum Halos</span>
          </button>

          <button
            onClick={() => setShowFireflies((f) => !f)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
              showFireflies
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
                : "bg-surface text-muted border-border hover:text-fg"
            )}
            title="Toggle orbiting 3D firefly point lights"
          >
            <Flame size={12} />
            <span>Dancing Fireflies</span>
          </button>

          <button
            onClick={() => setShowParticles((p) => !p)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
              showParticles
                ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold"
                : "bg-surface text-muted border-border hover:text-fg"
            )}
            title="Toggle orbiting stardust ember swarm"
          >
            <Radio size={12} />
            <span>Stardust Swarm</span>
          </button>

          <button
            onClick={() => setMagneticCursor((m) => !m)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
              magneticCursor
                ? "bg-neon-lime/15 text-[#6d8a00] dark:text-neon-lime border-neon-lime/30 font-semibold"
                : "bg-surface text-muted border-border hover:text-fg"
            )}
            title="Toggle surface tidal crest pulling toward cursor"
          >
            <Magnet size={12} />
            <span>Magnetic Pull</span>
          </button>
        </div>

        {/* Row 3: Fluid Dynamics Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
          {/* Distortion / Ripple intensity */}
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-surface/60 border border-border/60">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-muted" />
              <span className="text-xs font-mono text-muted">Fluid Ripple:</span>
            </div>
            <div className="flex items-center gap-2.5 flex-1 max-w-[180px]">
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={distortion}
                onChange={(e) => setDistortion(parseFloat(e.target.value))}
                className="w-full accent-neon-lime cursor-pointer"
              />
              <span className="text-xs font-mono text-fg w-8 text-right font-medium">
                {distortion.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Fluid Wave Speed */}
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-surface/60 border border-border/60">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-muted" />
              <span className="text-xs font-mono text-muted">Wave Speed:</span>
            </div>
            <div className="flex items-center gap-2.5 flex-1 max-w-[180px]">
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-neon-lime cursor-pointer"
              />
              <span className="text-xs font-mono text-fg w-8 text-right font-medium">
                {speed.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiquidOrbDemo;
