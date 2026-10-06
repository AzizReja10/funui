import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch";
import { HeroColorPanelsDemo } from "../components/showcase/HeroColorPanelsDemo";
import { BentoShowcaseDemo } from "../components/showcase/BentoShowcaseDemo";
import { GlassMetricCardDemo } from "../components/showcase/GlassMetricCardDemo";
import { Search, Mail, Sparkles, Send, Bell } from "lucide-react";

import { BiteButton } from "../components/ui/BiteButton";
import Typewriter from "../components/typewriter/Typewriter";
import { WindowsTimeline } from "../components/ui/WindowsTimeline";
import { WindowsTimelineDemo } from "../components/showcase/WindowsTimelineDemo";
import { RealisticGlobeDemo } from "../components/showcase/RealisticGlobeDemo";
import { LiquidOrbDemo } from "../components/showcase/LiquidOrbDemo";
import { UploadCard } from "../components/ui/UploadCard";
import { UploadCardDemo } from "../components/showcase/UploadCardDemo";
import { SeasonalCalendar } from "../components/ui/SeasonalCalendar";
import seasonalCalendarSource from "../components/ui/SeasonalCalendar.jsx?raw";
import Carousel from "../components/ui/Carousel";
import carouselSource from "../components/ui/Carousel.jsx?raw";
import { PulseProgressDemo } from "../components/showcase/PulseProgressDemo";
import pulseProgressSource from "../components/ui/PulseProgress.jsx?raw";
import TempCard from "../components/ui/TempCard";
import tempCardSource from "../components/ui/TempCard.jsx?raw";
import { PayFlowDemo } from "../components/showcase/PayFlowDemo";
import payFlowSource from "../components/ui/PayFlow.jsx?raw";

const carouselItems = [
  {
    id: 1,
    title: "Mountain Peaks",
    description: "Snow-capped summits reaching into the twilight sky.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Forest Canopy",
    description: "Sunlight filtering through ancient emerald redwoods.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Desert Dunes",
    description: "Golden sand ridges carved by desert winds.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Ocean Coastline",
    description: "Waves gently crashing onto serene rocky shores.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Aurora Skies",
    description: "Vibrant polar auroras dancing across frozen northern fjords.",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80",
  },
];

export const registry = [
  {
    slug: "button",
    name: "Button",
    category: "Actions & Controls",
    badge: null,
    description: "Tactile buttons engineered with click micro-interactions, jello wobble physics, six color treatments, and multi-size variants.",
    tags: ["Button", "Interactive", "Jelly", "Click", "Trigger", "Tactile"],
    installation: "npx shadcn@latest add button",
    dependencies: ["clsx", "tailwind-merge"],
    demo: (
      <div className="flex flex-col items-center justify-center gap-6 p-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="jelly">Jelly Button</Button>
          <Button variant="accent">Electric Lime</Button>
          <Button variant="primary">Royal Blue</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large Action</Button>
        </div>
      </div>
    ),
    code: `import { Button } from "@/components/ui/Button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="jelly">Jelly Button</Button>
      <Button variant="accent">Electric Lime</Button>
      <Button variant="primary">Royal Blue</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}`,
    props: [
      { name: "variant", type: "'default' | 'jelly' | 'accent' | 'primary' | 'outline' | 'ghost' | 'destructive'", default: "'default'", description: "Visual style treatment, including squishy 'jelly' with 3D gelatin lighting" },
      { name: "size", type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", description: "Button scale, padding, and font dimensions" },
      { name: "className", type: "string", default: "undefined", description: "Optional additional CSS classes for style overrides" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables interaction and dims opacity" },
    ],
  },
  {
    slug: "bite-button",
    name: "Bite Button",
    category: "Actions & Controls",
    badge: "fun",
    description: "Tactile Jelly Button with plump 3D gelatin lighting, jello-horizontal wobble animation, permanent bite removal, and bursting 3D jelly droplets.",
    tags: ["Jelly", "Interactive", "BiteButton", "Gummy", "Wobble", "Fun"],
    installation: "components/ui/BiteButton.jsx",
    dependencies: ["lucide-react", "canvas-confetti"],
    demo: (
      <div className="w-full flex flex-col items-center justify-center p-2">
        <BiteButton label="TASTE ME" kicker="JELLY GUMMY" />
      </div>
    ),
    code: `import { BiteButton } from "@/components/ui/BiteButton";

export default function BiteButtonDemo() {
  return (
    <BiteButton
      label="TASTE ME"
      sublabel="CLICK TO NIBBLE"
      kicker="JELLY GUMMY"
      onBite={(biteCount) => console.log(\`Bite count: \${biteCount}\`)}
      onReset={() => console.log("Button reset!")}
    />
  );
}`,
    props: [
      { name: "label", type: "string", default: "'TASTE ME'", description: "Primary center text stamped onto the jelly button face" },
      { name: "kicker", type: "string", default: "'JELLY GUMMY'", description: "Top uppercase mono banner text" },
      { name: "sublabel", type: "string", default: "'CLICK TO NIBBLE'", description: "Bottom helper instruction or subtitle" },
      { name: "onBite", type: "(biteCount: number) => void", default: "undefined", description: "Callback triggered on each bite click" },
      { name: "onReset", type: "() => void", default: "undefined", description: "Callback triggered on 360° spin reset" },
      { name: "className", type: "string", default: "undefined", description: "Additional classes for container styling" },
    ],
  },
  {
    slug: "seasonal-calendar",
    name: "Seasonal Calendar",
    category: "Featured & Hero",
    badge: "new",
    description: "Atmospheric seasonal calendar component featuring season-specific celestial color palettes, dynamic procedural particles (snow, petals, autumn leaves, heat shimmers), rolling hill horizon silhouettes, 3D month-flip transitions, and poetic seasonal epigraphs.",
    tags: ["Calendar", "Seasonal", "Framer Motion", "Interactive", "DatePicker", "Animation", "Micro-Interactions"],
    installation: "components/ui/SeasonalCalendar.jsx",
    dependencies: ["framer-motion"],
    demo: (
      <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
        <SeasonalCalendar
          weekStartsOn={0}
          onSelect={(date) => console.log("Selected date:", date)}
        />
      </div>
    ),
    code: seasonalCalendarSource,
    props: [
      { name: "initialDate", type: "Date", default: "new Date()", description: "Initial date to display in the calendar view" },
      { name: "weekStartsOn", type: "0 | 1 | 2 | 3 | 4 | 5 | 6", default: "0", description: "Day of the week to start on (0 for Sunday, 1 for Monday, etc.)" },
      { name: "onSelect", type: "(date: Date) => void", default: "undefined", description: "Callback triggered when a calendar date cell is clicked or selected" },
    ],
  },
  {
    slug: "carousel",
    name: "Carousel",
    category: "Featured & Hero",
    badge: "new",
    description: "Clean, physics-driven 3D coverflow carousel built with Framer Motion. Features spring-based gestural dragging, smooth perspective rotation, animated active pill indicator, auto-play with progress bar, and keyboard navigation.",
    tags: ["Carousel", "Slider", "Framer Motion", "Spring", "3D", "Coverflow", "Gestures", "Touch", "Micro-Interactions"],
    installation: "components/ui/Carousel.jsx",
    dependencies: ["framer-motion", "lucide-react"],
    demo: (
      <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
        <Carousel items={carouselItems} initialIndex={1} />
      </div>
    ),
    code: carouselSource,
    props: [
      { name: "items", type: "Array<{ id, title, description, image, badge? }>", default: "required", description: "Array of slide items to render" },
      { name: "initialIndex", type: "number", default: "0", description: "Initial active slide index" },
      { name: "autoPlay", type: "boolean", default: "true", description: "Enables automatic slide cycling" },
      { name: "interval", type: "number", default: "5000", description: "Interval timing between automatic slides in milliseconds" },
      { name: "showControls", type: "boolean", default: "true", description: "Show left/right navigation arrow buttons" },
      { name: "showIndicators", type: "boolean", default: "true", description: "Show bottom capsule pill indicators" },
      { name: "showProgress", type: "boolean", default: "true", description: "Show autoplay progress bar" },
    ],
  },
  {
    slug: "pulse-progress",
    name: "Pulse Progress",
    category: "Featured & Hero",
    badge: "new",
    description: "Fluid harmonic progress indicator featuring real-time sine wave motion, ECG heartbeat pulse spike when paused, rolling odometer counter numbers, and circular play/pause ring control.",
    tags: ["PulseProgress", "Progress", "ECG", "Wave", "Animation", "Heartbeat", "Micro-Interactions", "Counter", "Indicator"],
    installation: "components/ui/PulseProgress.jsx",
    dependencies: [],
    demo: <PulseProgressDemo />,
    code: pulseProgressSource,
    props: [
      { name: "value", type: "number (0-100)", default: "undefined", description: "Controlled progress value (0-100). If omitted, the component simulates progress autonomously." },
      { name: "paused", type: "boolean", default: "false", description: "Controlled paused state" },
      { name: "onPausedChange", type: "(nextPaused: boolean) => void", default: "undefined", description: "Callback triggered when play/pause state changes" },
      { name: "onComplete", type: "() => void", default: "undefined", description: "Callback triggered once when progress reaches 100%" },
    ],
  },
  {
    slug: "temp-card",
    name: "Temp Card",
    category: "Featured & Hero",
    badge: "new",
    description: "Atmospheric dark glass temperature card where real-time liquid rises with temperature, glowing dial ticks track the degrees, and colors shift dynamically between cold and hot hues.",
    tags: ["TempCard", "Weather", "Temperature", "Liquid", "Glassmorphism", "Dial", "Micro-Interactions", "Animation"],
    installation: "components/ui/TempCard.jsx",
    dependencies: [],
    demo: (
      <div className="w-full flex items-center justify-center p-8 bg-[#e9e8e4] dark:bg-[#111216] rounded-2xl min-h-[420px] transition-colors">
        <TempCard />
      </div>
    ),
    code: tempCardSource,
    props: [],
  },
  {
    slug: "upload-card",
    name: "Upload Card",
    category: "Featured & Hero",
    badge: "new",
    description: "High-performance video upload card driven by Framer Motion springs and GSAP timelines. Features 3D cursor tilt, glowing corner reticles, traveling photon arc bead, 20-segment spring equalizer, real-time speed & ETA telemetry, and a multi-shape 3D celebration confetti burst.",
    tags: ["Upload", "Video", "GSAP", "Framer Motion", "Progress", "Equalizer", "Confetti", "Interactive", "Micro-Interactions"],
    installation: "components/ui/UploadCard.jsx",
    dependencies: ["framer-motion", "gsap", "lucide-react"],
    demo: <UploadCardDemo />,
    code: `import { UploadCard } from "@/components/ui/UploadCard";

export default function UploadCardExample() {
  return (
    <div className="flex items-center justify-center p-8 bg-zinc-950 min-h-[500px]">
      <UploadCard
        uploadDuration={7.5}
        enableSound={true}
        onUploadComplete={(file) => {
          console.log("Upload completed:", file.name);
        }}
      />
    </div>
  );
}`,
    props: [
      { name: "uploadDuration", type: "number", default: "7.5", description: "Simulated upload duration in seconds" },
      { name: "initialFile", type: "File | { name, size, type }", default: "null", description: "Initial file object or mock video metadata" },
      { name: "enableSound", type: "boolean", default: "true", description: "Enables synthetic Web Audio API procedural sound feedback (blips, ticks, chime)" },
      { name: "presetFiles", type: "Array<{ name, size, type, res? }>", default: "[...]", description: "List of preset demo video files available for one-click simulation" },
      { name: "onUploadComplete", type: "(file: File) => void", default: "undefined", description: "Callback triggered once the upload progress reaches 100%" },
      { name: "className", type: "string", default: "''", description: "Optional CSS classes to append to the wrapper container" },
    ],
  },
  {
    slug: "pay-flow",
    name: "Pay Flow (UPI)",
    category: "Featured & Hero",
    badge: "new",
    description: "Authentic, tactile UPI payment flow featuring company-specific animations (Dominos dominoes, Apple MagSafe laser ring, Starbucks espresso steam, Swiggy speed scooter, Netflix prism ribbon, Uber GPS route), interactive PIN keypad, procedural sound synthesis, and spring-loaded settlement.",
    tags: ["Payment", "UPI", "PayFlow", "Keypad", "Domino", "Animation", "Physics", "Fintech", "Micro-Interactions", "Multi-Company"],
    installation: "components/ui/PayFlow.jsx",
    dependencies: [],
    demo: <PayFlowDemo />,
    code: payFlowSource,
    props: [
      { name: "payee", type: "string", default: "'Dominos'", description: "Merchant or recipient name displayed on the header (auto-detects company animation)" },
      { name: "company", type: "'auto' | 'dominos' | 'apple' | 'starbucks' | 'swiggy' | 'netflix' | 'uber'", default: "'auto'", description: "Explicit company animation theme override; defaults to auto-detecting based on payee" },
      { name: "amount", type: "number", default: "340", description: "Payment amount in rupees to be transferred and counted up on success" },
      { name: "currency", type: "string", default: "'₹'", description: "Currency symbol prefix" },
      { name: "upiId", type: "string", default: "'dominos@okhdfc'", description: "Virtual Payment Address (VPA) / UPI ID of recipient" },
      { name: "timestamp", type: "string", default: "'3 Oct 2026, 11:09 pm'", description: "Formatted transaction date and time" },
      { name: "autoDemo", type: "boolean", default: "true", description: "Automatically simulates typing the PIN on mount so users see the flow immediately" },
      { name: "demoPin", type: "string", default: "'482916'", description: "6-digit PIN code typed during auto-demo simulation" },
      { name: "soundEnabled", type: "boolean", default: "false", description: "Enables synthetic Web Audio API procedural sound feedback tailored to each company" },
      { name: "initialScreen", type: "'pin' | 'load' | 'done'", default: "'pin'", description: "Initial screen to display; set to 'load' to directly preview the company animation" },
      { name: "onSuccess", type: "(details: { amount, payee, upiId, company }) => void", default: "undefined", description: "Callback triggered once the settlement screen completes" },
      { name: "onReset", type: "() => void", default: "undefined", description: "Callback triggered when the flow is reset" },
      { name: "className", type: "string", default: "''", description: "Additional CSS classes for outer smartphone container" },
    ],
  },
  {
    slug: "typewriter",
    name: "Typewriter",
    category: "Featured & Hero",
    badge: "new",
    description: "Skeuomorphic mechanical typewriter with interactive keyboard input, tactile keycap bevels, ribbon spools, hammer strike motion, spring-loaded carriage returns, bell flashes, and an ambient Three.js dust particle layer.",
    tags: ["Typewriter", "Interactive", "Keyboard", "Skeuomorphism", "Three.js", "Framer Motion", "Retro"],
    installation: "components/typewriter/Typewriter.jsx",
    dependencies: ["framer-motion", "three", "lucide-react"],
    demo: (
      <div className="w-full flex flex-col items-center justify-center p-2">
        <Typewriter />
      </div>
    ),
    code: `import Typewriter from "@/components/typewriter/Typewriter";

export default function TypewriterDemo() {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-6 bg-zinc-950">
      <Typewriter />
    </div>
  );
}`,
    props: [
      { name: "className", type: "string", default: "''", description: "Optional CSS classes to customize the outer machine chassis" },
      { name: "maxLines", type: "number", default: "6", description: "Maximum lines per paper sheet before reaching the page end limit" },
      { name: "initialSound", type: "boolean", default: "true", description: "Whether synthesized mechanical typewriter sound effects start enabled" },
    ],
  },
  {
    slug: "windows-timeline",
    name: "Windows Timeline",
    category: "Featured & Hero",
    badge: "new",
    description: "Minimalist multi-era Windows timeline slider featuring a simple Three.js 3D logo flip transition, rolling odometer numbers, flat reference ticks, and continuous real-time drag scrubbing with spring snap physics and keyboard accessibility.",
    tags: ["Timeline", "Slider", "Interactive", "Three.js", "Framer Motion", "Draggable", "Scrubber", "Windows", "Accessible"],
    installation: "components/ui/WindowsTimeline.jsx",
    dependencies: ["framer-motion", "three", "lucide-react"],
    demo: <WindowsTimelineDemo />,
    code: `import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---- data --------------------------------------------------------------
// Chronological timeline of all Windows releases with their respective logos.
// Supports both imported asset modules (e.g. \`import logo1 from './logos/1.png'\`) and static URLs:
export const OS_LIST = [
  { year: 1985, name: 'Windows 1.0',    era: 'classic', color: '#008080', logoSrc: '/logos/windows/1.png' },
  { year: 1990, name: 'Windows 3.0',    era: 'classic', color: '#4a5568', logoSrc: '/2.png' },
  { year: 1992, name: 'Windows 3.1',    era: 'classic', color: '#000080', logoSrc: '/3.png' },
  { year: 1993, name: 'Windows NT 3.1', era: 'classic', color: '#1a365d', logoSrc: '/4.png' },
  { year: 1994, name: 'Windows NT 3.5', era: 'classic', color: '#008080', logoSrc: '/5.png' },
  { year: 1995, name: 'Windows 95',     era: 'classic', color: '#008080', logoSrc: '/6.png' },
  { year: 1996, name: 'Windows NT 4.0', era: 'classic', color: '#2b6cb0', logoSrc: '/7.png' },
  { year: 1998, name: 'Windows 98',     era: 'classic', color: '#3a6ea5', logoSrc: '/8.png' },
  { year: 2000, name: 'Windows ME',     era: 'classic', color: '#2e8540', logoSrc: '/9.png' },
  { year: 2000, name: 'Windows 2000',   era: 'classic', color: '#3a6ea5', logoSrc: '/10.png' },
  { year: 2001, name: 'Windows XP',     era: 'aero',    color: '#2a8ddc', logoSrc: '/11.png' },
  { year: 2006, name: 'Windows Vista',  era: 'aero',    color: '#2f6fb8', logoSrc: '/12.png' },
  { year: 2009, name: 'Windows 7',      era: 'aero',    color: '#1e88c7', logoSrc: '/13.png' },
  { year: 2012, name: 'Windows 8',      era: 'flat',    color: '#00a4ef', logoSrc: '/14.png' },
  { year: 2013, name: 'Windows 8.1',    era: 'flat',    color: '#0097e6', logoSrc: '/15.png' },
  { year: 2015, name: 'Windows 10',     era: 'flat',    color: '#0078d4', logoSrc: '/16.png' },
  { year: 2020, name: 'Windows 10X',    era: 'flat',    color: '#0091ff', logoSrc: '/17.png' },
  { year: 2021, name: 'Windows 11',     era: 'flat',    color: '#0067c0', logoSrc: '/18.png' },
];

const AUTO_MS = 2000;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pctFor = (i, count) => (count <= 1 ? 0 : (i / (count - 1)) * 100);

export function WinMark({ entry, size = 72, className }) {
  if (entry.logoSrc) {
    return (
      <img
        src={entry.logoSrc}
        alt={entry.name}
        className="h-16 sm:h-20 w-auto max-w-[220px] object-contain select-none drop-shadow-sm dark:drop-shadow-[0_0_1.5px_rgba(255,255,255,0.75)]"
        draggable={false}
      />
    );
  }
  const glossy = entry.era === 'aero';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M4 14 L46 8 L46 47 L4 51 Z" fill={entry.color} />
      <path d="M50 7.4 L96 2 L96 46.4 L50 47 Z" fill={entry.color} />
      <path d="M4 55 L46 55.6 L46 94.6 L4 98 Z" fill={entry.color} opacity="0.94" />
      <path d="M50 55.6 L96 56.2 L96 100 L50 99.4 Z" fill={entry.color} opacity="0.94" />
      {glossy && <path d="M4 14 L96 2 L96 30 L4 38 Z" fill="white" opacity="0.22" />}
    </svg>
  );
}

export function RollingNumber({ value, className }) {
  const digits = String(value).split('');
  return (
    <span className={\`inline-flex \${className || ''}\`}>
      {digits.map((d, i) => (
        <span key={i} className="relative inline-block overflow-hidden" style={{ width: '0.62em', height: '1.1em' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={d}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

export function CrossfadeText({ value, className }) {
  return (
    <span className={\`relative inline-block overflow-hidden \${className || ''}\`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="block whitespace-nowrap"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function WindowsTimeline({
  items = OS_LIST,
  autoPlay = true,
  autoInterval = AUTO_MS,
  defaultActive = 0,
  onChange,
}) {
  const [active, setActive] = useState(defaultActive);
  const [playing, setPlaying] = useState(autoPlay);
  const [dragging, setDragging] = useState(false);
  const [dragPct, setDragPct] = useState(null);
  const trackRef = useRef(null);
  const count = items.length;

  useEffect(() => {
    if (!playing || count === 0) return;
    const id = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % count;
        onChange?.(items[next], next);
        return next;
      });
    }, autoInterval);
    return () => clearInterval(id);
  }, [playing, count, autoInterval, items, onChange]);

  function updateFromClientX(clientX) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const fraction = rect.width > 0 ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0;
    const nearest = Math.round(fraction * (count - 1));
    setActive(nearest);
    setDragPct(fraction * 100);
    onChange?.(items[nearest], nearest);
  }

  function onPointerDown(e) {
    setPlaying(false);
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e) {
    if (dragging) updateFromClientX(e.clientX);
  }

  function onPointerUp() {
    setDragging(false);
    setDragPct(null);
    if (autoPlay) setPlaying(true);
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActive((a) => {
        const next = Math.min(count - 1, a + 1);
        onChange?.(items[next], next);
        return next;
      });
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive((a) => {
        const next = Math.max(0, a - 1);
        onChange?.(items[next], next);
        return next;
      });
    }
  }

  const displayPct = dragging && dragPct != null ? dragPct : pctFor(active, count);
  const current = items[active] || items[0];

  return (
    <div
      className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14 select-none"
      onMouseEnter={() => !dragging && setPlaying(false)}
      onMouseLeave={() => !dragging && autoPlay && setPlaying(true)}
    >
      {/* logo + year + name */}
      <div className="flex flex-col items-center gap-3 mb-14 min-h-[150px] justify-center">
        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <WinMark entry={current} size={72} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-center leading-tight">
          <div className="font-sans font-semibold text-2xl text-gray-900 dark:text-zinc-100">
            <RollingNumber value={current.year} />
          </div>
          <CrossfadeText
            value={current.name}
            className="font-sans text-sm text-gray-500 dark:text-zinc-400 mt-0.5"
          />
        </div>
      </div>

      {/* draggable scrubber */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={count - 1}
        aria-valuenow={active}
        aria-valuetext={\`\${current.name} (\${current.year})\`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-10 flex items-center cursor-pointer touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg select-none"
      >
        {/* flat reference ticks */}
        <div className="absolute inset-x-0 flex justify-between pointer-events-none px-[1px]">
          {items.map((e, i) => (
            <span
              key={\`\${e.name}-\${e.year}-\${i}\`}
              className="w-px h-4 bg-gray-300 dark:bg-zinc-700 rounded-full"
            />
          ))}
        </div>

        {/* the draggable handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[3px] h-9 bg-gray-900 dark:bg-zinc-100 rounded-full shadow-xs cursor-grab active:cursor-grabbing"
          animate={{ left: \`\${displayPct}%\` }}
          transition={dragging ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }}
        />
      </div>

      {/* year labels */}
      <div className="flex justify-between mt-3 px-[1px]">
        {items.map((e, i) => (
          <span
            key={\`\${e.name}-\${e.year}-\${i}\`}
            onClick={() => {
              setActive(i);
              onChange?.(items[i], i);
            }}
            className={\`text-[9px] sm:text-[10px] md:text-[11px] font-mono transition-colors cursor-pointer select-none text-center \${
              i === active
                ? 'font-bold text-gray-900 dark:text-zinc-100 scale-105'
                : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
            }\`}
          >
            <span className="hidden sm:inline">{e.year}</span>
            <span className="sm:hidden">'{String(e.year).slice(-2)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}`,
    props: [
      { name: "items", type: "Array<{ year, name, era, color, logoSrc? }>", default: "OS_LIST", description: "Array of Windows milestones with year, display name, era ('classic' | 'aero' | 'flat'), brand color, and optional custom logo image URL" },
      { name: "autoPlay", type: "boolean", default: "true", description: "Whether the timeline automatically steps forward across milestone years" },
      { name: "autoInterval", type: "number", default: "2000", description: "Auto-advance dwell time per year in milliseconds" },
      { name: "defaultActive", type: "number", default: "0", description: "Initial selected year index" },
      { name: "onChange", type: "(item, index) => void", default: "undefined", description: "Callback triggered when year changes" },
      { name: "className", type: "string", default: "undefined", description: "Custom Tailwind class overrides for wrapper container" },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Actions & Controls",
    badge: null,
    description: "Accessible toggle switch with smooth animated thumb glide and focus ring indicators.",
    tags: ["Toggle", "Boolean", "Accessible"],
    installation: "npx shadcn@latest add switch",
    dependencies: ["clsx", "tailwind-merge"],
    demo: (
      <div className="flex flex-col gap-4 p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch defaultChecked />
          <span className="text-sm font-medium text-fg">Realtime streaming tokens</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch />
          <span className="text-sm font-medium text-fg">Automated tool call approval</span>
        </label>
      </div>
    ),
    code: `<Switch defaultChecked onChange={(checked) => console.log(checked)} />`,
    props: [
      { name: "defaultChecked", type: "boolean", default: "false", description: "Initial toggle state" },
      { name: "checked", type: "boolean", default: "undefined", description: "Controlled boolean value" },
      { name: "onChange", type: "(checked: boolean) => void", default: "undefined", description: "Callback when switch state changes" },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "Data Display",
    badge: null,
    description: "Compact status labels with electric lime, updated pink, cobalt blue, and subdued neutral weights.",
    tags: ["Status", "Label", "Pill", "Tag"],
    installation: "npx shadcn@latest add badge",
    dependencies: ["clsx", "tailwind-merge"],
    demo: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 p-4">
        <Badge variant="default">Default</Badge>
        <Badge variant="lime">Lime Accent</Badge>
        <Badge variant="updated">Updated 2.4</Badge>
        <Badge variant="blue">New Release</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="muted">Subtle Muted</Badge>
      </div>
    ),
    code: `<Badge variant="default">Default</Badge>
<Badge variant="lime">Lime Accent</Badge>
<Badge variant="updated">Updated 2.4</Badge>
<Badge variant="blue">New Release</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="muted">Subtle Muted</Badge>`,
    props: [
      { name: "variant", type: "'default' | 'lime' | 'updated' | 'blue' | 'outline' | 'muted'", default: "'default'", description: "Color style of badge pill" },
      { name: "size", type: "'sm' | 'xs'", default: "'sm'", description: "Pill padding and font scale" },
    ],
  },
  {
    slug: "card",
    name: "Card",
    category: "Surfaces & Layout",
    badge: null,
    description: "Structured surface with composed header, title, description, body, and footer slots.",
    tags: ["Surface", "Container", "Layout"],
    installation: "npx shadcn@latest add card",
    dependencies: ["clsx", "tailwind-merge"],
    demo: (
      <div className="w-full max-w-md p-2">
        <Card hover>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Autonomous Worker #402</CardTitle>
              <Badge variant="lime" size="xs">Active</Badge>
            </div>
            <CardDescription>Continuous deployment agent listening on websocket.</CardDescription>
          </CardHeader>
          <CardContent>
            Executed 42 tasks in the last 15 minutes. All end-to-end integration tests completed with zero errors.
          </CardContent>
          <CardFooter className="justify-between">
            <span className="text-xs text-muted font-mono">Last ping: 2s ago</span>
            <Button variant="outline" size="sm">Inspect Logs</Button>
          </CardFooter>
        </Card>
      </div>
    ),
    code: `<Card hover>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Autonomous Worker #402</CardTitle>
      <Badge variant="lime" size="xs">Active</Badge>
    </div>
    <CardDescription>Continuous deployment agent listening on websocket.</CardDescription>
  </CardHeader>
  <CardContent>
    Executed 42 tasks in the last 15 minutes with zero errors.
  </CardContent>
  <CardFooter className="justify-between">
    <span className="text-xs text-muted font-mono">Last ping: 2s ago</span>
    <Button variant="outline" size="sm">Inspect</Button>
  </CardFooter>
</Card>`,
    props: [
      { name: "hover", type: "boolean", default: "false", description: "Adds subtle border highlight and shadow elevation on hover" },
      { name: "className", type: "string", default: "''", description: "Custom Tailwind class overrides" },
    ],
  },
  {
    slug: "input",
    name: "Input",
    category: "Forms & Inputs",
    badge: null,
    description: "Form inputs with leading icon slot, keyboard accessibility, and refined focus rings.",
    tags: ["Form", "Text Input", "Accessible", "Icons"],
    installation: "npx shadcn@latest add input",
    dependencies: ["clsx", "tailwind-merge", "lucide-react"],
    demo: (
      <div className="w-full max-w-sm flex flex-col gap-3 p-4">
        <Input icon={Search} placeholder="Search components, primitives, blocks..." />
        <Input icon={Mail} placeholder="name@company.com" />
        <Input placeholder="Without icon..." />
      </div>
    ),
    code: `<Input icon={Search} placeholder="Search components..." />
<Input icon={Mail} placeholder="name@company.com" />
<Input placeholder="Without icon..." />`,
    props: [
      { name: "icon", type: "LucideIcon", default: "undefined", description: "Optional icon component placed on the left" },
      { name: "placeholder", type: "string", default: "''", description: "Placeholder text" },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents input interaction" },
    ],
  },
  {
    slug: "glass-metric",
    name: "Glass Metric Card",
    category: "Surfaces & Layout",
    badge: "new",
    description: "High-contrast analytics display with background neon ambient glow, trend indicators, and sparklines.",
    tags: ["Analytics", "Sparkline", "Glassmorphism", "Metrics"],
    installation: "components/ui/GlassMetricCard.jsx",
    dependencies: ["clsx", "tailwind-merge", "lucide-react"],
    demo: <GlassMetricCardDemo />,
    code: `import { Badge } from "@/components/ui/Badge";

export function MetricCard({ title, value, change, target }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface to-bg p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted uppercase">{title}</span>
        <Badge variant="lime">{change}</Badge>
      </div>
      <div className="mt-4 text-3xl font-extrabold">{value}</div>
      <div className="mt-4 text-xs text-muted">{target}</div>
    </div>
  );
}`,
    props: [
      { name: "title", type: "string", default: "''", description: "Label displayed in uppercase mono font" },
      { name: "value", type: "string | number", default: "''", description: "Primary stat figure" },
      { name: "trend", type: "string", default: "''", description: "Percentage delta indicator" },
    ],
  },
  {
    slug: "bento-grid",
    name: "Bento Showcase Grid",
    category: "Featured & Hero",
    badge: "updated",
    description: "Multi-slot asynchronous telemetry grid with real-time progress bars, stat tickers, and neon highlights.",
    tags: ["Bento", "Layout", "Dashboard", "Stats"],
    installation: "components/ui/BentoGrid.jsx",
    dependencies: ["lucide-react", "framer-motion"],
    demo: <BentoShowcaseDemo />,
    code: `import { Badge } from "@/components/ui/Badge";
import { Zap, ShieldCheck, Activity } from "lucide-react";

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-6">
        <Badge variant="lime">Telemetry</Badge>
        <h3 className="mt-3 text-xl font-bold">Realtime Streaming Engine</h3>
        <p className="text-sm text-muted">Zero latency token streamer.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <Badge variant="updated">Fast</Badge>
        <div className="text-3xl font-bold mt-2">0.4kb</div>
      </div>
    </div>
  );
}`,
    props: [
      { name: "columns", type: "number", default: "3", description: "Total column span for desktop layouts" },
      { name: "glow", type: "boolean", default: "true", description: "Enables radial neon ambient glow" },
    ],
  },
  {
    slug: "hero-color-panels",
    name: "Hero Color Panels",
    category: "Featured & Hero",
    badge: "new",
    description: "Split-layout hero section with responsive ColorPanels shader visuals, CTA content, and tech stack badges.",
    tags: ["Hero", "Split Layout", "3D Shader", "AI SDK", "Interactive"],
    installation: "components/ui/HeroColorPanels.jsx",
    dependencies: ["lucide-react", "framer-motion"],
    demo: <HeroColorPanelsDemo />,
    code: `import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";

export function HeroColorPanels() {
  const panels = [
    { gradient: "from-lime-400 via-emerald-400 to-teal-500", label: "Agent Runtime" },
    { gradient: "from-cyan-400 via-blue-500 to-indigo-600", label: "Tool Call Engine" },
    { gradient: "from-pink-500 via-rose-500 to-purple-600", label: "Workflow Graph" },
    { gradient: "from-purple-500 via-fuchsia-500 to-amber-500", label: "Artifact Stream" },
  ];

  return (
    <div className="relative w-full rounded-2xl border border-border bg-gradient-to-b from-surface to-bg p-8 sm:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left CTA */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Badge variant="lime">AI SDK Agents</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            AI SDK Agents <br />
            <span className="text-muted">Copy and Paste</span>
          </h1>
          <p className="text-muted max-w-lg">
            Full-stack Vercel AI SDK patterns for workflows, tool calling, and agent orchestration.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="default" size="lg">Browse Agents <ArrowRight size={16} /></Button>
            <Button variant="outline" size="lg">View Docs</Button>
          </div>
        </div>

        {/* Right 3D Panels */}
        <div className="lg:col-span-5 flex justify-center perspective-[1000px]">
          <div className="relative w-64 h-48 rotate-x-[15deg] rotate-y-[-25deg] rotate-z-[5deg]">
            {panels.map((p, i) => (
              <div
                key={i}
                className={\`absolute inset-0 rounded-2xl border border-white/40 bg-gradient-to-tr \${p.gradient} backdrop-blur-md\`}
                style={{ transform: \`translate3d(\${i * 18}px, \${-i * 14}px, \${i * 30}px)\` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`,
    props: [
      { name: "title", type: "string", default: "'AI SDK Agents'", description: "Main headline text for hero" },
      { name: "fanned", type: "boolean", default: "false", description: "Whether the 3D color panels start expanded" },
      { name: "ctaText", type: "string", default: "'Browse Agents'", description: "Label for the primary CTA button" },
      { name: "showBadges", type: "boolean", default: "true", description: "Displays tech stack pills at bottom" },
    ],
  },
  {
    slug: "realistic-globe",
    name: "Realistic Globe",
    category: "Featured & Hero",
    badge: "new",
    description: "Photorealistic 3D satellite Earth globe rendered with high-resolution NASA Blue Marble imagery, topographic normal relief, specular ocean reflections, drifting cloud deck, cinematic deep-space fly-in zoom, and interactive hub targeting.",
    tags: ["Globe", "3D", "Three.js", "Earth", "Satellite", "NASA", "Zoom", "OrbitControls", "PBR"],
    installation: "components/ui/RealisticGlobe.jsx",
    dependencies: ["three", "lucide-react"],
    demo: <RealisticGlobeDemo />,
    code: `'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function latLngToVec3(lat, lon, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createRoughnessTexture(specularImg) {
  const canvas = document.createElement('canvas');
  canvas.width = specularImg.width || 1024;
  canvas.height = specularImg.height || 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(specularImg, 0, 0, canvas.width, canvas.height);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const isOcean = d[i] > 90;
    const rough = isOcean ? 45 : 220;
    d[i] = rough;
    d[i + 1] = rough;
    d[i + 2] = rough;
    d[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

const DEFAULT_HUBS = [
  { name: 'New York', lat: 40.7, lon: -74.0 },
  { name: 'London', lat: 51.5, lon: -0.1 },
  { name: 'Tokyo', lat: 35.7, lon: 139.7 },
  { name: 'Sydney', lat: -33.9, lon: 151.2 },
  { name: 'São Paulo', lat: -23.5, lon: -46.6 },
  { name: 'Cairo', lat: 30.0, lon: 31.2 },
];
const DEFAULT_ARC_PAIRS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];

export default function RealisticGlobe({
  className = '',
  textureUrl = '/textures/earth_atmos_2048.jpg',
  normalMapUrl = '/textures/earth_normal_2048.jpg',
  specularMapUrl = '/textures/earth_specular_2048.jpg',
  cloudsUrl = '/textures/earth_clouds_1024.png',
  hubs = DEFAULT_HUBS,
  arcPairs = DEFAULT_ARC_PAIRS,
  autoRotate = true,
  autoRotateSpeed = 0.6,
  enableZoom = true,
  zoomDistance = 3.8,
  targetHub = null,
  cinematicFlyIn = true,
}) {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const targetCamPosRef = useRef(null);

  useEffect(() => {
    if (!cameraRef.current) return;
    if (targetHub && typeof targetHub.lat === 'number') {
      const dir = latLngToVec3(targetHub.lat, targetHub.lon, 1).normalize();
      targetCamPosRef.current = dir.multiplyScalar(2.1);
    } else if (zoomDistance) {
      const currentDir = cameraRef.current.position.clone().normalize();
      targetCamPosRef.current = currentDir.multiplyScalar(zoomDistance);
    }
  }, [zoomDistance, targetHub]);

  useEffect(() => {
    const container = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 0, cinematicFlyIn ? 10.5 : zoomDistance);

    const R = 1;
    const texLoader = new THREE.TextureLoader();

    // Satellite Day Map & Normal Relief
    const earthMap = texLoader.load(textureUrl);
    earthMap.colorSpace = THREE.SRGBColorSpace;
    const normalMap = normalMapUrl ? texLoader.load(normalMapUrl) : null;

    const planetGeo = new THREE.SphereGeometry(R, 96, 96);
    const planetMat = new THREE.MeshStandardMaterial({
      map: earthMap,
      normalMap: normalMap || undefined,
      normalScale: normalMap ? new THREE.Vector2(0.85, 0.85) : undefined,
      roughness: 0.65,
      metalness: 0.1,
    });

    if (specularMapUrl) {
      const specImg = new Image();
      specImg.crossOrigin = 'anonymous';
      specImg.onload = () => {
        const roughnessTex = createRoughnessTexture(specImg);
        if (roughnessTex) {
          planetMat.roughnessMap = roughnessTex;
          planetMat.roughness = 1.0;
          planetMat.needsUpdate = true;
        }
      };
      specImg.src = specularMapUrl;
    }

    const planet = new THREE.Mesh(planetGeo, planetMat);
    scene.add(planet);

    // Drifting Cloud Deck
    let clouds = null;
    if (cloudsUrl) {
      const cloudTex = texLoader.load(cloudsUrl);
      const cloudGeo = new THREE.SphereGeometry(R * 1.014, 96, 96);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        roughness: 1,
      });
      clouds = new THREE.Mesh(cloudGeo, cloudMat);
      scene.add(clouds);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(5, 2.5, 3.5);
    scene.add(sun);

    // OrbitControls with Zoom limits
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = enableZoom;
    controls.minDistance = 1.35;
    controls.maxDistance = 10.0;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;

    // Resize
    function resize() {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Loop with Cinematic Deep-Space Zoom Fly-In
    let elapsed = 0;
    let flyInDone = !cinematicFlyIn;
    let raf;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (!flyInDone) {
        elapsed += dt;
        const p = Math.min(1, elapsed / 2.0);
        const ease = 1 - Math.pow(1 - p, 4);
        const dist = 10.5 - (10.5 - zoomDistance) * ease;
        camera.position.copy(camera.position.clone().normalize().multiplyScalar(dist));
        if (p >= 1) flyInDone = true;
      }

      if (targetCamPosRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.06);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.02) {
          targetCamPosRef.current = null;
        }
      }

      if (clouds) clouds.rotation.y += dt * 0.025;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [textureUrl, normalMapUrl, specularMapUrl, cloudsUrl, enableZoom, zoomDistance, cinematicFlyIn]);

  return <div ref={mountRef} className={\`w-full h-full \${className}\`} />;
}

// Usage:
export function GlobeDemo() {
  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-2xl border border-border bg-gradient-to-b from-surface/50 via-surface/20 to-bg overflow-hidden shadow-xs">
      <RealisticGlobe />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_70%)]" />
    </div>
  );
}`,
    props: [
      { name: "className", type: "string", default: "''", description: "Optional CSS classes for outer container" },
      { name: "textureUrl", type: "string", default: "'/textures/earth_atmos_2048.jpg'", description: "High-resolution NASA Blue Marble satellite Earth texture URL" },
      { name: "normalMapUrl", type: "string", default: "'/textures/earth_normal_2048.jpg'", description: "Topographic relief normal map for mountain ranges and trenches" },
      { name: "specularMapUrl", type: "string", default: "'/textures/earth_specular_2048.jpg'", description: "Specular mask calibrated for realistic ocean highlights" },
      { name: "cloudsUrl", type: "string", default: "'/textures/earth_clouds_1024.png'", description: "Realistic satellite cloud deck texture URL" },
      { name: "enableZoom", type: "boolean", default: "true", description: "Allows interactive trackpad/scroll wheel zooming" },
      { name: "zoomDistance", type: "number", default: "3.8", description: "Camera viewing distance (1.35 close-up to 10.0 deep space)" },
      { name: "targetHub", type: "{ lat, lon, name }", default: "null", description: "Geographic coordinate to smoothly fly to and zoom into" },
      { name: "cinematicFlyIn", type: "boolean", default: "true", description: "Enables dramatic deep-space decelerating fly-in on mount" },
      { name: "autoRotate", type: "boolean", default: "true", description: "Enables orbital rotation with post-drag auto-resume" },
      { name: "autoRotateSpeed", type: "number", default: "0.6", description: "Speed of orbital auto-rotation" },
      { name: "hubs", type: "Array<{ name, lat, lon }>", default: "DEFAULT_HUBS", description: "Geographic city hub coordinates placed accurately on Earth" },
      { name: "arcPairs", type: "Array<[number, number]>", default: "DEFAULT_ARC_PAIRS", description: "City index pairs connected by 3D Bezier light arcs" },
      { name: "showClouds", type: "boolean", default: "true", description: "Renders the drifting satellite cloud deck" },
      { name: "showArcs", type: "boolean", default: "true", description: "Renders connection arcs and traveling photon pulses" },
      { name: "showStars", type: "boolean", default: "false", description: "Renders optional 3D starfield backdrop (false for clean light/dark theme integration)" },
      { name: "onHubHover", type: "(hub, index) => void", default: "null", description: "Callback triggered with hub data and index when hovering over a city marker" },
      { name: "onHubClick", type: "(hub, index) => void", default: "null", description: "Callback triggered with hub data and index when clicking a city marker" },
      { name: "onLocationSelect", type: "(location) => void", default: "null", description: "Callback triggered when clicking anywhere on the globe, providing country name, code, flag, region, and exact lat/lon" },
    ],
  },
  {
    slug: "liquid-orb",
    name: "Liquid Orb 3D",
    category: "3D & Creative",
    badge: "Creative",
    description: "Creative, lightweight Three.js fluid morphing sculpture with procedural harmonic waves, spring jello squish physics, mouse tilt, and 5 PBR material treatments with 0 KB texture assets.",
    tags: ["Three.js", "3D", "Liquid", "Orb", "Creative", "PBR", "Chrome", "Interactive", "Harmonic"],
    installation: "components/ui/LiquidOrb.jsx",
    dependencies: ["three"],
    demo: <LiquidOrbDemo />,
    code: `import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LiquidOrb({
  shape = "sphere", // 'sphere' | 'knot' | 'crystal' | 'ring'
  preset = "chrome", // 'chrome' | 'iridescent' | 'neon' | 'glass' | 'obsidian'
  speed = 1.0,
  distortion = 0.32,
  interactive = true,
  wireframe = false,
  className = "",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    // Procedural geometry
    let geo;
    if (shape === "knot") geo = new THREE.TorusKnotGeometry(0.95, 0.32, 100, 24);
    else if (shape === "crystal") geo = new THREE.IcosahedronGeometry(1.35, 4);
    else geo = new THREE.SphereGeometry(1.35, 54, 54);

    const origPositions = Float32Array.from(geo.attributes.position.array);

    const mat = new THREE.MeshStandardMaterial({
      color: preset === "neon" ? 0x141e06 : 0xf3f4f6,
      roughness: preset === "chrome" ? 0.12 : 0.25,
      metalness: 0.92,
      wireframe,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Studio lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    let squish = 1.0;
    let squishVelocity = 0;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 0.6;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1) * 0.6;
    };

    const handleClick = () => {
      squishVelocity = -0.35; // Tactile jello squish
    };

    if (interactive) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("click", handleClick);
    }

    let raf;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime() * speed;

      // Spring squish
      squishVelocity += (1.0 - squish) * 16.0 * dt;
      squishVelocity *= Math.pow(0.12, dt);
      squish += squishVelocity;

      // Procedural harmonic fluid ripple
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ox = origPositions[i * 3];
        const oy = origPositions[i * 3 + 1];
        const oz = origPositions[i * 3 + 2];
        const wave = Math.sin(ox * 2.4 + t * 2.2) * Math.cos(oy * 2.4 + t * 1.8) * Math.sin(oz * 2.4 + t * 2.0);
        const disp = 1.0 + wave * distortion * 0.32;
        pos.setXYZ(i, ox * disp * squish, oy * disp * (2.0 - squish), oz * disp * squish);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mesh.rotation.x = mouse.y * 0.5;
      mesh.rotation.y += dt * 0.4 + mouse.x * 0.02;

      renderer.render(scene, camera);
    }
    animate();

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("click", handleClick);
      }
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [shape, preset, speed, distortion, interactive, wireframe]);

  return <div ref={mountRef} className={\`w-full h-full cursor-grab \${className}\`} />;
}

// Usage:
export function Demo() {
  return (
    <div className="w-80 h-80 rounded-2xl border border-border bg-surface/50">
      <LiquidOrb shape="sphere" preset="chrome" />
    </div>
  );
}`,
    props: [
      { name: "shape", type: "'sphere' | 'knot' | 'crystal' | 'ring'", default: "'sphere'", description: "3D base geometry (Fluid Blob, Infinity Knot, Prism Crystal, Halo Ring)" },
      { name: "preset", type: "'chrome' | 'iridescent' | 'neon' | 'glass' | 'obsidian'", default: "'chrome'", description: "PBR studio lighting and material preset" },
      { name: "speed", type: "number", default: "1.0", description: "Speed of harmonic fluid ripples and auto-rotation" },
      { name: "distortion", type: "number", default: "0.32", description: "Amplitude of fluid wave displacement (0.0 for rigid, 0.8 for dramatic liquid waves)" },
      { name: "interactive", type: "boolean", default: "true", description: "Enables spring cursor tilt tracking and click jello squish physics" },
      { name: "wireframe", type: "boolean", default: "false", description: "Renders procedural 3D polygon wireframe cage" },
      { name: "showHalos", type: "boolean", default: "true", description: "Renders dual counter-rotating quantum gimbal halo rings with orbiting photon beads" },
      { name: "showFireflies", type: "boolean", default: "true", description: "Renders two dancing 3D Lissajous firefly light probes casting moving specular glints" },
      { name: "showParticles", type: "boolean", default: "true", description: "Renders a celestial swarm of 70 orbiting stardust embers that scatter on click" },
      { name: "magneticCursor", type: "boolean", default: "true", description: "Tidal ferrofluid surface pull that bulges directly towards the cursor in 3D" },
      { name: "autoRotate", type: "boolean", default: "true", description: "Enables continuous smooth orbital rotation" },
    ],
  },
];