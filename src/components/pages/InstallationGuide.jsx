import { useState } from "react";
import { CodeBlock } from "../CodeBlock";
import { Check, Terminal, ArrowRight, Sparkles, Layers, Box, Cpu, FileCode2, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

export function InstallationGuide({ onNavigate }) {
  const [framework, setFramework] = useState("nextjs"); // 'nextjs' | 'vite' | 'existing' | 'manual'
  const [packageManager, setPackageManager] = useState("pnpm"); // 'pnpm' | 'npm' | 'bun' | 'yarn'

  // Helper to generate commands based on selected package manager
  const getCommand = (type, args = "") => {
    switch (type) {
      case "create-next":
        if (packageManager === "pnpm") return "pnpm create next-app@latest my-app --typescript --tailwind --eslint";
        if (packageManager === "bun") return "bun create next-app my-app --typescript --tailwind --eslint";
        if (packageManager === "yarn") return "yarn create next-app my-app --typescript --tailwind --eslint";
        return "npx create-next-app@latest my-app --typescript --tailwind --eslint";

      case "create-vite":
        if (packageManager === "pnpm") return "pnpm create vite my-app --template react\ncd my-app\npnpm install";
        if (packageManager === "bun") return "bun create vite my-app --template react\ncd my-app\nbun install";
        if (packageManager === "yarn") return "yarn create vite my-app --template react\ncd my-app\nyarn";
        return "npm create vite@latest my-app -- --template react\ncd my-app\nnpm install";

      case "shadcn-init":
        if (packageManager === "pnpm") return "pnpm dlx shadcn@latest init";
        if (packageManager === "bun") return "bunx --bun shadcn@latest init";
        if (packageManager === "yarn") return "npx shadcn@latest init";
        return "npx shadcn@latest init";

      case "install-deps":
        if (packageManager === "pnpm") return `pnpm add ${args}`;
        if (packageManager === "bun") return `bun add ${args}`;
        if (packageManager === "yarn") return `yarn add ${args}`;
        return `npm install ${args}`;

      case "shadcn-add":
        if (packageManager === "pnpm") return `pnpm dlx shadcn@latest add ${args}`;
        if (packageManager === "bun") return `bunx --bun shadcn@latest add ${args}`;
        if (packageManager === "yarn") return `npx shadcn@latest add ${args}`;
        return `npx shadcn@latest add ${args}`;

      default:
        return "";
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted mb-2">
          <span>Docs</span>
          <span>/</span>
          <span className="text-fg font-medium">Getting Started</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
          Installation
        </h1>
        <p className="mt-2 text-base text-muted max-w-2xl leading-relaxed">
          How to configure shadcn/ui, set up Tailwind CSS, and drop FunUI primitives directly into your codebase.
        </p>
      </div>

      {/* Architecture Philosophy Callout - "Built on shadcn, not an npm package" */}
      <div className="relative overflow-hidden rounded-2xl border border-neon-lime/30 bg-gradient-to-r from-neon-lime/10 via-surface to-surface p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-lime text-black font-bold text-xs">
                ✓
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-fg">
                The shadcn/ui Philosophy
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-fg">
              Source Code Primitives — Not a Custom npm Library
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              FunUI components are not bundled in a black-box <code className="font-mono text-fg bg-surface px-1.5 py-0.5 rounded border border-border">node_modules</code> package. 
              Instead, they live directly inside your project under <code className="font-mono text-fg bg-surface px-1.5 py-0.5 rounded border border-border">@/components/ui/</code>. 
              You own the code, the Tailwind tokens, and the animations with zero library lock-in.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 text-[11px] font-mono text-muted">
            <div className="flex items-center gap-1.5 bg-surface/80 border border-border px-2.5 py-1 rounded-md">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Full Code Ownership</span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface/80 border border-border px-2.5 py-1 rounded-md">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Zero Bundle Bloat</span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface/80 border border-border px-2.5 py-1 rounded-md">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>100% shadcn Compatible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selectors Bar: Package Manager & Framework */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-border pb-6">
        {/* Framework Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted">
            1. Select Framework
          </label>
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-surface border border-border">
            {[
              { id: "nextjs", label: "Next.js" },
              { id: "vite", label: "Vite (React)" },
              { id: "existing", label: "Existing shadcn" },
              { id: "manual", label: "Manual" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFramework(t.id)}
                className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer text-center ${
                  framework === t.id
                    ? "bg-bg text-fg font-semibold shadow-xs border border-border/80"
                    : "text-muted hover:text-fg hover:bg-surface-hover"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Package Manager Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted">
            2. Package Manager
          </label>
          <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border">
            {["pnpm", "npm", "bun", "yarn"].map((pm) => (
              <button
                key={pm}
                onClick={() => setPackageManager(pm)}
                className={`flex-1 py-1.5 px-2 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer text-center ${
                  packageManager === pm
                    ? "bg-bg text-fg font-semibold shadow-xs border border-border/80"
                    : "text-muted hover:text-fg hover:bg-surface-hover"
                }`}
              >
                {pm}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== FRAMEWORK: NEXT.JS ==================== */}
      {framework === "nextjs" && (
        <div className="space-y-10">
          {/* Step 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                1
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Create Next.js Project
              </h2>
            </div>
            <p className="text-sm text-muted">
              Scaffold a new Next.js application using the App Router with TypeScript and Tailwind CSS enabled.
            </p>
            <CodeBlock
              code={getCommand("create-next")}
              title="Terminal"
              isCommand
            />
          </section>

          {/* Step 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                2
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Initialize shadcn/ui
              </h2>
            </div>
            <p className="text-sm text-muted">
              Run the official shadcn CLI to configure your project structure, <code className="text-xs font-mono bg-surface px-1 py-0.5 rounded border border-border">components.json</code>, and the <code className="text-xs font-mono bg-surface px-1 py-0.5 rounded border border-border">cn()</code> utility:
            </p>
            <CodeBlock
              code={getCommand("shadcn-init")}
              title="Terminal"
              isCommand
            />
            <div className="rounded-xl border border-border bg-surface/60 p-3.5 text-xs text-muted font-mono space-y-1">
              <div className="text-fg font-semibold">Recommended CLI Answers:</div>
              <div className="text-muted">✔ Which style would you like to use? › <span className="text-fg">Default</span></div>
              <div className="text-muted">✔ Which color would you like to use as base color? › <span className="text-fg">Neutral</span></div>
              <div className="text-muted">✔ Would you like to use CSS variables for colors? › <span className="text-neon-lime">yes</span></div>
            </div>
          </section>

          {/* Step 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                3
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Install Core Dependencies
              </h2>
            </div>
            <p className="text-sm text-muted">
              FunUI tactile primitives use <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">clsx</code>, <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">tailwind-merge</code>, <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">lucide-react</code>, and <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">framer-motion</code>:
            </p>
            <CodeBlock
              code={getCommand("install-deps", "clsx tailwind-merge lucide-react framer-motion")}
              title="Terminal"
              isCommand
            />
            <p className="text-xs text-muted italic">
              Note: 3D and canvas primitives (Typewriter, Realistic Globe, Liquid Orb) also use <code className="font-mono text-fg">three</code> and <code className="font-mono text-fg">canvas-confetti</code>.
            </p>
          </section>

          {/* Step 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                4
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Verify the shadcn <code className="font-mono text-base">cn</code> Utility
              </h2>
            </div>
            <p className="text-sm text-muted">
              The shadcn CLI automatically created <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">src/lib/utils.ts</code> (or <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">lib/utils.js</code>). Ensure it exports the <code className="text-xs font-mono bg-surface px-1 py-0.5 rounded border border-border">cn</code> helper:
            </p>
            <CodeBlock
              code={`import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}`}
              title="src/lib/utils.js"
            />
          </section>

          {/* Step 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                5
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Add Components to Your Project
              </h2>
            </div>
            <p className="text-sm text-muted">
              You can initialize standard shadcn primitives via the CLI:
            </p>
            <CodeBlock
              code={getCommand("shadcn-add", "button")}
              title="Terminal"
              isCommand
            />
            <p className="text-sm text-muted pt-2">
              For custom FunUI primitives (such as <strong className="text-fg font-semibold">Bite Button</strong>, <strong className="text-fg font-semibold">Windows Timeline</strong>, or <strong className="text-fg font-semibold">Typewriter</strong>), click the <span className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded border border-border">Code</span> tab on any component page, copy the source code, and save it in your project's <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">@/components/ui/</code> directory.
            </p>
          </section>

          {/* Step 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                6
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Import and Build
              </h2>
            </div>
            <p className="text-sm text-muted">
              Import and compose your components directly in your page or layout:
            </p>
            <CodeBlock
              code={`import { Button } from "@/components/ui/button";
import { BiteButton } from "@/components/ui/BiteButton";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <Button variant="default">Shadcn Button</Button>
      <BiteButton label="TASTE ME" kicker="JELLY GUMMY" />
    </main>
  );
}`}
              title="src/app/page.jsx"
            />
          </section>
        </div>
      )}

      {/* ==================== FRAMEWORK: VITE ==================== */}
      {framework === "vite" && (
        <div className="space-y-10">
          {/* Step 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                1
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Create Vite Project
              </h2>
            </div>
            <p className="text-sm text-muted">
              Initialize a clean, blazing-fast React project using Vite:
            </p>
            <CodeBlock
              code={getCommand("create-vite")}
              title="Terminal"
              isCommand
            />
          </section>

          {/* Step 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                2
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Configure Path Aliases (<code className="font-mono text-base">@/*</code>)
              </h2>
            </div>
            <p className="text-sm text-muted">
              shadcn uses path aliases like <code className="text-xs font-mono bg-surface px-1 py-0.5 rounded border border-border">@/components</code> and <code className="text-xs font-mono bg-surface px-1 py-0.5 rounded border border-border">@/lib/utils</code>. Configure the resolve alias in your <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">vite.config.js</code>:
            </p>
            <CodeBlock
              code={`import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});`}
              title="vite.config.js"
            />
            <p className="text-xs text-muted">
              If using JavaScript, create or update <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded border border-border">jsconfig.json</code>:
            </p>
            <CodeBlock
              code={`{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}
              title="jsconfig.json"
            />
          </section>

          {/* Step 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                3
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Initialize shadcn/ui
              </h2>
            </div>
            <p className="text-sm text-muted">
              Run the shadcn initialization wizard:
            </p>
            <CodeBlock
              code={getCommand("shadcn-init")}
              title="Terminal"
              isCommand
            />
          </section>

          {/* Step 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                4
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Install Required Dependencies
              </h2>
            </div>
            <p className="text-sm text-muted">
              Install the animation and utility packages:
            </p>
            <CodeBlock
              code={getCommand("install-deps", "clsx tailwind-merge lucide-react framer-motion")}
              title="Terminal"
              isCommand
            />
          </section>

          {/* Step 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                5
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Add Components to <code className="font-mono text-base">src/components/ui/</code>
              </h2>
            </div>
            <p className="text-sm text-muted">
              Copy any component source code from the FunUI catalog into your project's <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">src/components/ui/</code> folder.
            </p>
            <CodeBlock
              code={`// Example: src/components/ui/button.jsx
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="flex gap-3 p-8">
      <Button variant="default">Button</Button>
    </div>
  );
}`}
              title="src/App.jsx"
            />
          </section>
        </div>
      )}

      {/* ==================== FRAMEWORK: EXISTING SHADCN ==================== */}
      {framework === "existing" && (
        <div className="space-y-8">
          <div className="rounded-xl border border-neon-lime/30 bg-surface/50 p-4 flex items-center gap-3">
            <Sparkles size={20} className="text-neon-lime shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-fg">30-Second Setup:</span> If your project already has <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded border border-border">components.json</code> and shadcn/ui configured, you are ready to go immediately!
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                1
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Ensure Peer Dependencies Are Installed
              </h2>
            </div>
            <p className="text-sm text-muted">
              Most projects already have <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">clsx</code> and <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">tailwind-merge</code>. Ensure you also have <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">framer-motion</code> and <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">lucide-react</code>:
            </p>
            <CodeBlock
              code={getCommand("install-deps", "framer-motion lucide-react")}
              title="Terminal"
              isCommand
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                2
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Copy Any Component into <code className="font-mono text-base">@/components/ui/</code>
              </h2>
            </div>
            <p className="text-sm text-muted">
              Navigate to any component in the FunUI catalog, click the <span className="font-semibold text-fg">Code</span> tab, copy the code, and paste it into your <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded border border-border">components/ui/</code> folder.
            </p>
            <p className="text-xs text-muted">
              All primitives natively utilize your existing <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded border border-border">@/lib/utils</code> and standard shadcn CSS variables (<code className="font-mono text-fg">--background</code>, <code className="font-mono text-fg">--foreground</code>, <code className="font-mono text-fg">--border</code>, etc.).
            </p>
          </section>
        </div>
      )}

      {/* ==================== FRAMEWORK: MANUAL SETUP ==================== */}
      {framework === "manual" && (
        <div className="space-y-10">
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                1
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Install Utilities
              </h2>
            </div>
            <CodeBlock
              code={getCommand("install-deps", "clsx tailwind-merge lucide-react framer-motion")}
              title="Terminal"
              isCommand
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                2
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Add <code className="font-mono text-base">components.json</code>
              </h2>
            </div>
            <p className="text-sm text-muted">
              Place this at the root of your project to conform to shadcn standards:
            </p>
            <CodeBlock
              code={`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}`}
              title="components.json"
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                3
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Add <code className="font-mono text-base">src/lib/utils.js</code>
              </h2>
            </div>
            <CodeBlock
              code={`import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}`}
              title="src/lib/utils.js"
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
                4
              </span>
              <h2 className="font-heading text-lg font-bold text-fg">
                Configure Tailwind CSS Variables
              </h2>
            </div>
            <CodeBlock
              code={`/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        fg: "var(--fg)",
        muted: "var(--fg-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          fg: "var(--accent-fg)",
        },
      },
    },
  },
  plugins: [],
};`}
              title="tailwind.config.js"
            />
          </section>
        </div>
      )}

      {/* FAQ Accordion / Reference Section */}
      <div className="border-t border-border pt-10 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-neon-lime" />
          <h2 className="font-heading text-xl font-bold text-fg">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-surface/50 p-5 space-y-2">
            <h4 className="font-heading text-sm font-semibold text-fg">
              Why not publish as a regular npm library?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Traditional npm libraries hide component code in <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded">node_modules</code>. If you need to tweak a micro-interaction, change Tailwind styling, or optimize bundle size, you run into walls. The shadcn model gives you 100% direct ownership of the source code.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface/50 p-5 space-y-2">
            <h4 className="font-heading text-sm font-semibold text-fg">
              Can I use TypeScript?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Yes! All FunUI primitives can be saved with a <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded">.tsx</code> extension. Standard React prop interfaces match standard HTML elements seamlessly.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface/50 p-5 space-y-2">
            <h4 className="font-heading text-sm font-semibold text-fg">
              Does this work with Tailwind CSS v3 and v4?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Yes, all component classes use standardized Tailwind utility classes and CSS variables compatible with both Tailwind v3 and Tailwind v4.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface/50 p-5 space-y-2">
            <h4 className="font-heading text-sm font-semibold text-fg">
              How do dark mode colors work?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Components use CSS variables defined in your root stylesheet (<code className="font-mono text-fg bg-surface px-1 py-0.5 rounded">--bg</code>, <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded">--fg</code>, <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded">--border</code>). Toggling the <code className="font-mono text-fg bg-surface px-1 py-0.5 rounded">.dark</code> class updates all primitives instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Next steps banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-semibold text-fg">Ready to build?</h3>
          <p className="text-xs text-muted mt-0.5">Explore the full catalog of tactile primitives, mechanical inputs, and 3D hero shaders.</p>
        </div>
        <Button
          variant="default"
          onClick={() => onNavigate("button")}
          className="gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>Explore Primitives</span>
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
