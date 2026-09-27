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

export const registry = [
  {
    slug: "button",
    name: "Button",
    category: "Actions & Controls",
    badge: null,
    description: "Tactile buttons engineered with click micro-interactions, jello wobble physics, six color treatments, and multi-size variants.",
    tags: ["Button", "Interactive", "Jelly", "Click", "Trigger", "Tactile"],
    installation: "npx funui add button",
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
    installation: "npx funui add bite-button",
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
    slug: "typewriter",
    name: "Typewriter",
    category: "Featured & Hero",
    badge: "new",
    description: "Skeuomorphic mechanical typewriter with interactive keyboard input, tactile keycap bevels, ribbon spools, hammer strike motion, spring-loaded carriage returns, bell flashes, and an ambient Three.js dust particle layer.",
    tags: ["Typewriter", "Interactive", "Keyboard", "Skeuomorphism", "Three.js", "Framer Motion", "Retro"],
    installation: "npx funui add typewriter",
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
    installation: "npx funui add windows-timeline",
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
    installation: "npx funui add switch",
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
    installation: "npx funui add badge",
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
    installation: "npx funui add card",
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
    installation: "npx funui add input",
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
    installation: "npx funui add glass-metric",
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
    installation: "npx funui add bento-grid",
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
    installation: "npx funui add hero-color-panels",
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
];