import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch";
import { HeroColorPanelsDemo } from "../components/showcase/HeroColorPanelsDemo";
import { BentoShowcaseDemo } from "../components/showcase/BentoShowcaseDemo";
import { GlassMetricCardDemo } from "../components/showcase/GlassMetricCardDemo";
import { Search, Mail, Sparkles, Send, Bell } from "lucide-react";

export const registry = [
  {
    slug: "hero-color-panels",
    name: "Hero Color Panels",
    category: "Featured & Hero",
    badge: "new",
    description: "Split-layout hero section with responsive ColorPanels shader visuals, CTA content, and tech stack badges.",
    tags: ["Hero", "Split Layout", "3D Shader", "AI SDK", "Interactive"],
    installation: "bunx forma-ui add hero-color-panels",
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
    slug: "bento-grid",
    name: "Bento Showcase Grid",
    category: "Featured & Hero",
    badge: "updated",
    description: "Multi-slot asynchronous telemetry grid with real-time progress bars, stat tickers, and neon highlights.",
    tags: ["Bento", "Layout", "Dashboard", "Stats"],
    installation: "bunx forma-ui add bento-grid",
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
    slug: "button",
    name: "Button",
    category: "Actions & Controls",
    badge: null,
    description: "Six tactile button variants with micro-interactions, size presets, icon slots, and active scale feedback.",
    tags: ["Primitive", "Input", "Action", "Accessible"],
    installation: "bunx forma-ui add button",
    demo: (
      <div className="flex flex-wrap items-center justify-center gap-3 p-4">
        <Button variant="default">Default</Button>
        <Button variant="accent">Electric Lime</Button>
        <Button variant="primary">Royal Blue</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="default" size="sm">Small</Button>
        <Button variant="default" size="lg">Large Action</Button>
      </div>
    ),
    code: `<Button variant="default">Default</Button>
<Button variant="accent">Electric Lime</Button>
<Button variant="primary">Royal Blue</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>`,
    props: [
      { name: "variant", type: "'default' | 'accent' | 'primary' | 'outline' | 'ghost' | 'destructive'", default: "'default'", description: "Visual appearance style" },
      { name: "size", type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", description: "Button dimensions and font sizing" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables interaction and dims opacity" },
    ],
  },
  {
    slug: "card",
    name: "Card",
    category: "Surfaces & Layout",
    badge: null,
    description: "Structured surface with composed header, title, description, body, and footer slots.",
    tags: ["Surface", "Container", "Layout"],
    installation: "bunx forma-ui add card",
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
    slug: "glass-metric",
    name: "Glass Metric Card",
    category: "Surfaces & Layout",
    badge: "new",
    description: "High-contrast analytics display with background neon ambient glow, trend indicators, and sparklines.",
    tags: ["Analytics", "Sparkline", "Glassmorphism", "Metrics"],
    installation: "bunx forma-ui add glass-metric",
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
    slug: "badge",
    name: "Badge",
    category: "Data Display",
    badge: null,
    description: "Compact status labels with electric lime, updated pink, cobalt blue, and subdued neutral weights.",
    tags: ["Status", "Label", "Pill", "Tag"],
    installation: "bunx forma-ui add badge",
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
    slug: "input",
    name: "Input",
    category: "Forms & Inputs",
    badge: null,
    description: "Form inputs with leading icon slot, keyboard accessibility, and refined focus rings.",
    tags: ["Form", "Text Input", "Accessible", "Icons"],
    installation: "bunx forma-ui add input",
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
    slug: "switch",
    name: "Switch",
    category: "Actions & Controls",
    badge: null,
    description: "Accessible toggle switch with smooth animated thumb glide and focus ring indicators.",
    tags: ["Toggle", "Boolean", "Accessible"],
    installation: "bunx forma-ui add switch",
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
];