import { useState } from 'react';
import { RealisticGlobe } from '../ui/RealisticGlobe';
import { DEFAULT_HUBS } from '../../data/globeData';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Eye, Radio, Globe, Navigation, Compass } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';

// Standard clean usage as requested by user
export function GlobeDemo() {
  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-2xl border border-border bg-gradient-to-b from-surface/50 via-surface/20 to-bg overflow-hidden shadow-xs">
      <RealisticGlobe />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_70%)]" />
    </div>
  );
}

// Rich interactive showcase with telemetry HUD, smooth zoom controls, and fly-to city inspector
export function RealisticGlobeDemo() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showArcs, setShowArcs] = useState(true);
  const [zoomDistance, setZoomDistance] = useState(3.8);
  const [targetHub, setTargetHub] = useState(null);
  const [globeKey, setGlobeKey] = useState(0);

  const handleZoomIn = () => {
    setTargetHub(null);
    setZoomDistance((z) => Math.max(1.85, Number((z - 0.75).toFixed(2))));
  };

  const handleZoomOut = () => {
    setTargetHub(null);
    setZoomDistance((z) => Math.min(7.5, Number((z + 0.75).toFixed(2))));
  };

  const handleReplayFlyIn = () => {
    setTargetHub(null);
    setZoomDistance(3.8);
    setAutoRotate(true);
    setGlobeKey((k) => k + 1);
  };

  const handleSelectCity = (hub) => {
    if (targetHub?.name === hub.name) {
      // Toggle off / back to overview
      setTargetHub(null);
      setZoomDistance(3.8);
      setAutoRotate(true);
    } else {
      // Focus and zoom into selected city
      setTargetHub(hub);
      setZoomDistance(2.1);
      setAutoRotate(false);
    }
  };

  const resetAll = () => {
    setAutoRotate(true);
    setShowClouds(true);
    setShowArcs(true);
    setZoomDistance(3.8);
    setTargetHub(null);
    setGlobeKey((k) => k + 1);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-border bg-gradient-to-b from-surface/80 via-surface/40 to-bg backdrop-blur-sm overflow-hidden shadow-xl transition-all">
      {/* Top Header / Telemetry Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border/70 bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Globe size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold text-fg">Satellite Earth</span>
              <Badge variant="lime" size="xs">NASA Map</Badge>
            </div>
            <p className="text-[11px] text-muted font-mono">
              High-Res Texture • Topographic Relief • Specular Oceans • Interactive Zoom
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom In & Out */}
          <div className="inline-flex items-center rounded-lg border border-border bg-bg/80 p-0.5">
            <button
              onClick={handleZoomIn}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-surface text-muted hover:text-fg transition-colors cursor-pointer"
              title="Zoom in closer to Earth"
            >
              <ZoomIn size={14} />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-muted">
              {zoomDistance < 2.5 ? 'Close' : zoomDistance < 4.5 ? 'Orbit' : 'Deep Space'}
            </span>
            <button
              onClick={handleZoomOut}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-surface text-muted hover:text-fg transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
          </div>

          {/* Auto Spin */}
          <button
            onClick={() => setAutoRotate((r) => !r)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-bg/80 hover:bg-surface text-xs font-medium text-fg transition-colors cursor-pointer"
            title={autoRotate ? "Pause rotation" : "Enable rotation"}
          >
            {autoRotate ? (
              <>
                <Pause size={12} className="text-amber-500 fill-amber-500" />
                <span>Spin</span>
              </>
            ) : (
              <>
                <Play size={12} className="text-emerald-500 fill-emerald-500" />
                <span>Paused</span>
              </>
            )}
          </button>

          {/* Fly-in Replay */}
          <button
            onClick={handleReplayFlyIn}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-bg/80 hover:bg-surface text-xs font-medium text-fg transition-colors cursor-pointer"
            title="Replay dramatic space fly-in zoom"
          >
            <Compass size={13} className="text-sky-400" />
            <span className="hidden sm:inline">Space Fly-In</span>
          </button>

          <button
            onClick={resetAll}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-bg/80 hover:bg-surface text-muted hover:text-fg transition-colors cursor-pointer"
            title="Reset default view"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Box - Theme adaptive (no forced dark background) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[580px] bg-gradient-to-b from-surface/40 via-surface/80 to-bg overflow-hidden select-none border-y border-border/70">
        {/* Subtle radial ambient glow layer */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_75%)]" />

        {/* The 3D Realistic Globe */}
        <RealisticGlobe
          key={globeKey}
          autoRotate={autoRotate}
          showClouds={showClouds}
          showArcs={showArcs}
          enableZoom={true}
          zoomDistance={zoomDistance}
          targetHub={targetHub}
          cinematicFlyIn={true}
          onHubClick={handleSelectCity}
          className="relative z-10"
        />

        {/* Drag & Zoom Hint overlay on bottom left */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 dark:bg-zinc-900/90 border border-border shadow-xs backdrop-blur-md text-[11px] text-fg font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Scroll to zoom • Drag to rotate</span>
        </div>

        {/* Active Focus Pill on bottom right */}
        {targetHub ? (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 backdrop-blur-md text-[11px] text-amber-700 dark:text-amber-300 font-mono shadow-xs">
            <Navigation size={12} className="text-amber-500" />
            <span className="font-semibold">Target: {targetHub.name} ({targetHub.lat}°, {targetHub.lon}°)</span>
            <button
              onClick={() => {
                setTargetHub(null);
                setZoomDistance(3.8);
                setAutoRotate(true);
              }}
              className="ml-1 text-xs text-muted hover:text-fg cursor-pointer"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 dark:bg-zinc-900/90 border border-border shadow-xs backdrop-blur-md text-[11px] text-muted font-mono">
            <Radio size={12} className="text-amber-500 animate-pulse" />
            <span>Hover city for info • Click to zoom</span>
          </div>
        )}
      </div>

      {/* Feature toggles & hub pills footer */}
      <div className="relative z-10 p-4 sm:p-5 border-t border-border/70 bg-surface/30 flex flex-col gap-4">
        {/* Toggle Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-medium text-muted mr-1">Layers:</span>
            <button
              onClick={() => setShowClouds((s) => !s)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                showClouds
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold"
                  : "bg-surface text-muted border-border hover:text-fg"
              )}
            >
              <Eye size={12} />
              <span>Cloud Drift</span>
            </button>

            <button
              onClick={() => setShowArcs((s) => !s)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                showArcs
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
                  : "bg-surface text-muted border-border hover:text-fg"
              )}
            >
              <Radio size={12} />
              <span>Light Trails</span>
            </button>
          </div>

          {/* Connected Hubs list (click to fly to and zoom in) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-mono text-muted mr-1">Fly to:</span>
            {DEFAULT_HUBS.map((hub) => (
              <button
                key={hub.name}
                onClick={() => handleSelectCity(hub)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-mono cursor-pointer transition-all border",
                  targetHub?.name === hub.name
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/60 font-bold shadow-xs scale-105"
                    : "bg-surface text-muted border-border hover:text-fg hover:border-fg/40"
                )}
                title={`Zoom and fly to ${hub.name}`}
              >
                {hub.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealisticGlobeDemo;
