import { useState } from "react";
import PayFlow from "../ui/PayFlow";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Store,
  Sparkles,
  Eye,
  CheckCircle2,
  Pizza,
  Coffee,
  Bike,
  Tv,
  Car,
  Smartphone,
} from "lucide-react";

const PRESETS = [
  {
    name: "Dominos",
    company: "dominos",
    tagline: "Domino Physics Fall",
    icon: Pizza,
    amount: 340,
    currency: "₹",
    upiId: "dominos@okhdfc",
    timestamp: "3 Oct 2026, 11:09 pm",
    demoPin: "482916",
    color: "#006491",
  },
  {
    name: "Apple Store",
    company: "apple",
    tagline: "MagSafe Laser Halo",
    icon: Smartphone,
    amount: 8900,
    currency: "₹",
    upiId: "apple@hdfcbank",
    timestamp: "Just now",
    demoPin: "729415",
    color: "#0071E3",
  },
  {
    name: "Starbucks",
    company: "starbucks",
    tagline: "Espresso Pour & Steam",
    icon: Coffee,
    amount: 450,
    currency: "₹",
    upiId: "starbucks@axisbank",
    timestamp: "Today, 4:15 pm",
    demoPin: "318520",
    color: "#006241",
  },
  {
    name: "Swiggy",
    company: "swiggy",
    tagline: "Speed Delivery Scooter",
    icon: Bike,
    amount: 189,
    currency: "₹",
    upiId: "swiggy@icici",
    timestamp: "Today, 1:20 pm",
    demoPin: "940281",
    color: "#FC8019",
  },
  {
    name: "Netflix",
    company: "netflix",
    tagline: "Cinematic Ribbon Prism",
    icon: Tv,
    amount: 649,
    currency: "₹",
    upiId: "netflix@icici",
    timestamp: "Monthly auto-pay",
    demoPin: "194820",
    color: "#E50914",
  },
  {
    name: "Uber",
    company: "uber",
    tagline: "GPS Route Glide",
    icon: Car,
    amount: 320,
    currency: "₹",
    upiId: "uber@axisbank",
    timestamp: "Trip completed",
    demoPin: "552914",
    color: "#276EF1",
  },
];

export function PayFlowDemo() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoDemo, setAutoDemo] = useState(false);
  const [initialScreen, setInitialScreen] = useState("pin");
  const [demoKey, setDemoKey] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const currentPreset = PRESETS[activePresetIndex];

  // Play full simulated payment flow
  const handleReplayDemo = () => {
    setInitialScreen("pin");
    setAutoDemo(true);
    setDemoKey((k) => k + 1);
  };

  // Preview loader animation immediately
  const handlePreviewLoader = () => {
    setAutoDemo(false);
    setInitialScreen("load");
    setDemoKey((k) => k + 1);
  };

  // Preview success settlement tick animation immediately
  const handlePreviewSuccess = () => {
    setAutoDemo(false);
    setInitialScreen("done");
    setDemoKey((k) => k + 1);
  };

  // Reset to manual keypad entry
  const handleResetManual = () => {
    setAutoDemo(false);
    setInitialScreen("pin");
    setDemoKey((k) => k + 1);
  };

  const handleSuccess = (details) => {
    setRecentTransactions((prev) => [
      {
        id: Math.random().toString(36).substring(2, 7),
        payee: details.payee,
        amount: details.amount,
        company: details.company,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev.slice(0, 3),
    ]);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-2 sm:p-6">
      {/* Top Toolbar / Configuration Strip */}
      <div className="w-full max-w-2xl flex flex-col gap-3 p-3 rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-md text-xs shadow-2xs">
        {/* Preset Company Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
          <div className="flex items-center gap-1.5 text-muted font-medium">
            <Store size={14} className="text-neon-lime" />
            <span className="font-semibold text-fg">Select Company:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESETS.map((p, idx) => {
              const Icon = p.icon;
              const isActive = activePresetIndex === idx;

              return (
                <button
                  key={p.company}
                  type="button"
                  onClick={() => {
                    setActivePresetIndex(idx);
                    setInitialScreen("pin");
                    setAutoDemo(false);
                    setDemoKey((k) => k + 1);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-accent-fg font-semibold shadow-xs ring-1 ring-accent"
                      : "bg-surface-hover text-muted hover:text-fg"
                  }`}
                >
                  <Icon size={13} style={{ color: isActive ? "inherit" : p.color }} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Active Animation Badge & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          {/* Active Company Animation Tagline */}
          <div className="flex items-center gap-2">
            <span className="text-muted">Unique Animation:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-surface border border-border text-fg">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentPreset.color }}
              />
              {currentPreset.tagline}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Preview Animation Only */}
            <button
              type="button"
              onClick={handlePreviewLoader}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                initialScreen === "load"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "bg-surface border-border text-fg hover:bg-surface-hover font-medium"
              }`}
              title="Instantly jumps to the company loading animation"
            >
              <Eye size={12} className="text-emerald-500" />
              <span>Preview Animation</span>
            </button>

            {/* Quick Preview Success Tick Animation */}
            <button
              type="button"
              onClick={handlePreviewSuccess}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                initialScreen === "done"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "bg-surface border-border text-fg hover:bg-surface-hover font-medium"
              }`}
              title="Instantly tests the tick mark transition animation"
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>Preview Tick</span>
            </button>

            {/* Run Auto Demo */}
            <button
              type="button"
              onClick={handleReplayDemo}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-fg hover:bg-surface-hover font-medium transition-all cursor-pointer"
              title="Auto-types PIN and triggers full payment flow"
            >
              <Play size={12} className="fill-current text-blue-500" />
              <span>Full Flow Demo</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                soundEnabled
                  ? "border-neon-lime/40 text-[#6d8a00] dark:text-neon-lime bg-neon-lime/10"
                  : "border-border text-muted hover:text-fg bg-surface"
              }`}
              title={soundEnabled ? "Sound enabled (Company tailored audio chimes)" : "Sound muted"}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            {/* Reset Keypad */}
            <button
              type="button"
              onClick={handleResetManual}
              className="p-1.5 rounded-lg border border-border text-muted hover:text-fg bg-surface hover:bg-surface-hover transition-all cursor-pointer"
              title="Reset keypad to manual entry"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Helper Banner */}
      <div className="flex items-center gap-2 text-xs text-muted font-mono bg-surface/50 border border-border/60 px-3.5 py-1.5 rounded-full">
        <Sparkles size={13} className="text-amber-500" />
        <span>Each company features its own tailored physics animation, status copy, and audio chime</span>
      </div>

      {/* Main Phone Stage */}
      <div className="w-full flex justify-center py-2 sm:py-4">
        <PayFlow
          key={`${activePresetIndex}-${demoKey}-${autoDemo}-${initialScreen}`}
          payee={currentPreset.name}
          company={currentPreset.company}
          amount={currentPreset.amount}
          currency={currentPreset.currency}
          upiId={currentPreset.upiId}
          timestamp={currentPreset.timestamp}
          demoPin={currentPreset.demoPin}
          autoDemo={autoDemo}
          soundEnabled={soundEnabled}
          initialScreen={initialScreen}
          onSuccess={handleSuccess}
        />
      </div>

      {/* Transaction History Activity */}
      {recentTransactions.length > 0 && (
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface/50 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono text-[11px] text-muted uppercase">
            <span>Settlement Log</span>
            <span>UPI Network</span>
          </div>
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-1 border-t border-border/40 font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-medium text-fg">{tx.payee}</span>
                <span className="text-[10px] text-muted">({tx.company})</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <span className="text-emerald-500 font-semibold">₹{tx.amount}</span>
                <span className="text-[10px]">{tx.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
