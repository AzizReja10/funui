import { Contrast, Menu } from "lucide-react";
import { BloomLogo } from "./BloomLogo";
import { SearchInput } from "../ui/SearchInput";

export function Navbar({ isDark, onToggleTheme, onOpenMobileMenu, onNavigate, onOpenSearch, activeSlug = "home" }) {
  const activeNav = activeSlug === "home" ? "home" : activeSlug === "installation" ? "install" : "blocks";

  const navLinks = [
    { id: "home", label: "Home", href: "/", action: () => onNavigate?.("home") },
    {
      id: "blocks",
      label: "Blocks",
      href: activeSlug && activeSlug !== "home" && activeSlug !== "installation" ? `/components/${activeSlug}` : "/components/button",
      action: () => {
        if (activeSlug && activeSlug !== "home" && activeSlug !== "installation") {
          onNavigate?.(activeSlug);
        } else {
          onNavigate?.("button");
        }
      },
    },
    { id: "install", label: "Installation", href: "/installation", action: () => onNavigate?.("installation") },
    { id: "mcp", label: "MCP", badge: "WIP", action: () => alert("MCP skills and agent primitives coming soon!") },
  ];

  return (
    <div className="sticky top-4 z-50 w-full flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto inline-flex items-center gap-4 sm:gap-6 h-[52px] rounded-full border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md shadow-[0_2px_14px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-3.5 sm:px-5 transition-all">
        {/* Left: Scalloped Rosette Flower Logo + FunUI Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.("home");
          }}
          className="flex items-center gap-2.5 group select-none cursor-pointer shrink-0 border-none bg-transparent"
        >
          <BloomLogo className="w-[30px] h-[30px]" />
          <span className="font-heading text-[16px] sm:text-[17px] font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
            FunUI
          </span>
        </a>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 sm:gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href || "#"}
              onClick={(e) => {
                if (link.action) {
                  e.preventDefault();
                  link.action();
                }
              }}
              className="relative inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer group whitespace-nowrap bg-transparent border-none"
            >
              <span className={activeNav === link.id ? "text-neutral-900 dark:text-white font-semibold" : ""}>
                {link.label}
              </span>

              {link.badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-pink-100/90 dark:bg-pink-950/70 text-[9px] font-mono font-bold tracking-wider text-pink-600 dark:text-pink-400 uppercase leading-none">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Docs Search Button / Input */}
        {onOpenSearch && (
          <div className="hidden lg:block shrink-0">
            <SearchInput
              placeholder="Search docs..."
              readOnly
              onClick={onOpenSearch}
              className="cursor-pointer"
            />
          </div>
        )}

        {/* Right: Enclosed Mini Capsule Pill [Contrast | Sign in] */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="rounded-full border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/80 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-3 py-1 flex items-center gap-2.5 transition-colors cursor-pointer select-none">
            <button
              type="button"
              onClick={onToggleTheme}
              className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center p-0.5"
              aria-label="Toggle theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <Contrast size={14} className="transition-transform duration-300 hover:rotate-180" />
            </button>

            <span className="w-[1px] h-3.5 bg-neutral-200 dark:bg-neutral-700 shrink-0" />

            <button
              type="button"
              onClick={() => alert("Welcome to FunUI! Sign in flow.")}
              className="text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Sign in
            </button>
          </div>

          {/* Mobile menu icon (visible on narrow screens) */}
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu size={15} />
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
