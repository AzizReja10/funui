import { useState } from "react";
import { Contrast, Menu, Search, X } from "lucide-react";
import { BloomLogo } from "./BloomLogo";

export function Navbar({ isDark, onToggleTheme, onOpenSearch, onOpenMobileMenu }) {
  const [activeNav, setActiveNav] = useState("blocks");

  const navLinks = [
    { id: "blocks", label: "Blocks", href: "#blocks" },
    { id: "mcp", label: "MCP", href: "#mcp", badge: "WIP" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
    { id: "faq", label: "FAQ", href: "#faq" },
    { id: "blog", label: "Blog", href: "#blog" },
  ];

  return (
    <div className="sticky top-3 sm:top-5 z-40 w-full px-3 sm:px-6 pointer-events-none flex justify-center">
      <header className="pointer-events-auto w-full max-w-4xl h-14 sm:h-15 rounded-full border border-border/80 bg-bg/90 dark:bg-surface/90 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] flex items-center justify-between px-3.5 sm:px-5 transition-all">
        {/* Left: Scalloped Flower Logo + Brand Name */}
        <a
          href="#"
          className="flex items-center gap-2.5 group select-none cursor-pointer"
        >
          <BloomLogo className="h-8.5 w-8.5 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-serif text-[17px] sm:text-[18px] font-semibold tracking-tight text-fg">
            Native Bloom
          </span>
        </a>

        {/* Center: Clean Nav Items */}
        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-muted">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setActiveNav(link.id)}
              className="relative inline-flex items-center gap-1.5 hover:text-fg transition-colors group cursor-pointer"
            >
              <span className={activeNav === link.id ? "text-fg font-semibold" : ""}>
                {link.label}
              </span>

              {link.badge && (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-[9px] font-mono font-bold tracking-wider text-muted group-hover:text-fg transition-colors uppercase">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Right: Pill Capsule with Theme Toggle + Divider + Sign In */}
        <div className="flex items-center gap-2">
          {/* Quick Search Shortcut button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-muted hover:text-fg hover:bg-surface transition-colors text-xs font-mono"
            aria-label="Search components"
            title="Search (⌘K)"
          >
            <Search size={13} />
            <kbd className="text-[10px] text-muted">⌘K</kbd>
          </button>

          {/* Encapsulated Pill Button: [Contrast Icon | Sign in] */}
          <div className="rounded-full border border-border/90 bg-surface/40 hover:bg-surface px-3 sm:px-3.5 py-1.5 flex items-center gap-2.5 text-xs sm:text-[13px] font-medium transition-all shadow-2xs">
            <button
              onClick={onToggleTheme}
              className="text-muted hover:text-fg transition-colors cursor-pointer flex items-center justify-center p-0.5"
              aria-label="Toggle dark / light theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <Contrast size={14} className="transition-transform duration-300 hover:rotate-180" />
            </button>

            <span className="w-[1px] h-3.5 bg-border shrink-0" />

            <button
              onClick={() => alert("Welcome to Native Bloom! Sign-in dialog or auth flow.")}
              className="text-fg hover:opacity-80 transition-opacity font-medium cursor-pointer"
            >
              Sign in
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-surface text-fg"
            aria-label="Open mobile menu"
          >
            <Menu size={15} />
          </button>
        </div>
      </header>
    </div>
  );
}
