import { useState } from "react";
import { CodeBlock } from "../CodeBlock";
import { Check, Terminal, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function InstallationGuide({ onNavigate }) {
  const [framework, setFramework] = useState("vite"); // 'vite' | 'nextjs' | 'manual'

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
          Installation Guide
        </h1>
        <p className="mt-2 text-base text-muted max-w-2xl leading-relaxed">
          How to install dependencies, configure Tailwind CSS, and add FunUI primitives to your project.
        </p>
      </div>

      {/* Framework Tabs */}
      <div className="space-y-4">
        <span className="font-heading text-sm font-semibold uppercase tracking-wider text-fg">
          Choose your framework
        </span>
        <div className="inline-flex items-center p-1 rounded-xl bg-surface border border-border">
          {[
            { id: "vite", label: "Vite (React)" },
            { id: "nextjs", label: "Next.js (App Router)" },
            { id: "manual", label: "Manual Setup" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFramework(t.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                framework === t.id
                  ? "bg-bg text-fg font-semibold shadow-xs"
                  : "text-muted hover:text-fg hover:bg-surface-hover"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step by step walkthrough */}
      <div className="space-y-10 border-t border-border pt-8">
        {/* Step 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
              1
            </span>
            <h2 className="font-heading text-lg font-bold text-fg">
              {framework === "nextjs" ? "Create Next.js Project" : "Create Vite React Project"}
            </h2>
          </div>
          <p className="text-sm text-muted">
            {framework === "nextjs"
              ? "Initialize a new Next.js project with TypeScript and Tailwind CSS configured."
              : "Scaffold a new lightweight React project using Vite."}
          </p>
          <CodeBlock
            code={
              framework === "nextjs"
                ? "npx create-next-app@latest my-app --typescript --tailwind --eslint"
                : "npm create vite@latest my-app -- --template react\ncd my-app"
            }
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
              Install Required Dependencies
            </h2>
          </div>
          <p className="text-sm text-muted">
            FunUI uses <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface border border-border">clsx</code> and <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface border border-border">tailwind-merge</code> to merge class names reliably, and <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface border border-border">lucide-react</code> for icons.
          </p>
          <CodeBlock
            code="npm install clsx tailwind-merge lucide-react"
            title="Terminal"
            isCommand
          />
        </section>

        {/* Step 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
              3
            </span>
            <h2 className="font-heading text-lg font-bold text-fg">
              Add the Class Merge Utility
            </h2>
          </div>
          <p className="text-sm text-muted">
            Create a file at <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface border border-border">src/lib/cn.js</code> to handle conditional Tailwind class combinations:
          </p>
          <CodeBlock
            code={`import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}`}
            title="src/lib/cn.js"
          />
        </section>

        {/* Step 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
              4
            </span>
            <h2 className="font-heading text-lg font-bold text-fg">
              Configure Tailwind CSS & CSS Variables
            </h2>
          </div>
          <p className="text-sm text-muted">
            Ensure your <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface border border-border">tailwind.config.js</code> includes the proper color variables:
          </p>
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

        {/* Step 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
              5
            </span>
            <h2 className="font-heading text-lg font-bold text-fg">
              Add Your First Component
            </h2>
          </div>
          <p className="text-sm text-muted">
            You can either use the FunUI CLI or manually copy-paste the component code from the catalog:
          </p>
          <CodeBlock
            code="npx funui add button"
            title="Terminal"
            isCommand
          />
        </section>

        {/* Step 6 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fg text-bg font-mono text-xs font-bold">
              6
            </span>
            <h2 className="font-heading text-lg font-bold text-fg">
              Import and Use
            </h2>
          </div>
          <p className="text-sm text-muted">
            Import the component into any page or layout:
          </p>
          <CodeBlock
            code={`import { Button } from "@/components/ui/Button";

export default function App() {
  return (
    <div className="flex gap-3 p-8">
      <Button variant="default">Default Button</Button>
      <Button variant="accent">Electric Lime</Button>
    </div>
  );
}`}
            title="src/App.jsx"
          />
        </section>
      </div>

      {/* Next steps banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-semibold text-fg">Ready to build?</h3>
          <p className="text-xs text-muted mt-0.5">Explore the full catalog of accessible primitives and interactive hero shaders.</p>
        </div>
        <Button
          variant="default"
          onClick={() => onNavigate("button")}
          className="gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>Explore Components</span>
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
