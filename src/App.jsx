import { useState, useEffect } from "react";
import { AnnouncementBanner } from "./components/layout/AnnouncementBanner";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { RightSidebar } from "./components/layout/RightSidebar";
import { SearchModal } from "./components/layout/SearchModal";
import { ComponentDemo } from "./components/ComponentDemo";
import { registry } from "./data/registry";
import { ArrowRight, ChevronRight, Github, Heart, Sparkles, X } from "lucide-react";

export default function App() {
  const [activeSlug, setActiveSlug] = useState(registry[0]?.slug || "hero-color-panels");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("forma-theme") === "dark" ||
        (!("forma-theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("forma-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("forma-theme", "light");
    }
  }, [isDark]);

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  function handleSelect(slug) {
    setActiveSlug(slug);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentIndex = registry.findIndex((item) => item.slug === activeSlug);
  const activeItem = registry[currentIndex] || registry[0];
  const prevItem = currentIndex > 0 ? registry[currentIndex - 1] : null;
  const nextItem = currentIndex < registry.length - 1 ? registry[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col font-sans selection:bg-neon-lime selection:text-black transition-colors duration-200">
      {/* Top High-Impact Announcement Banner */}
      <AnnouncementBanner onSelectFeatured={() => handleSelect("hero-color-panels")} />

      {/* Sticky Main Navigation */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main 3-Column Documentation Container */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 flex pt-2 sm:pt-4">
        {/* Left Column: Desktop Navigation Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            items={registry}
            activeSlug={activeSlug}
            onSelect={handleSelect}
          />
        </div>

        {/* Center Column: Documentation & Interactive Showcase */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 max-w-4xl">
          <ComponentDemo
            item={activeItem}
            hasPrev={!!prevItem}
            hasNext={!!nextItem}
            onPrev={() => prevItem && handleSelect(prevItem.slug)}
            onNext={() => nextItem && handleSelect(nextItem.slug)}
          />

          {/* Next / Previous Component Navigation Footer */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevItem ? (
              <button
                onClick={() => handleSelect(prevItem.slug)}
                className="w-full sm:w-auto flex flex-col items-start p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-fg/20 transition-all text-left cursor-pointer group"
              >
                <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                  ← Previous
                </span>
                <span className="text-sm font-semibold text-fg mt-0.5 group-hover:text-neon-lime transition-colors">
                  {prevItem.name}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextItem && (
              <button
                onClick={() => handleSelect(nextItem.slug)}
                className="w-full sm:w-auto flex flex-col items-end p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-fg/20 transition-all text-right cursor-pointer group ml-auto"
              >
                <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                  Next Up →
                </span>
                <span className="text-sm font-semibold text-fg mt-0.5 group-hover:text-neon-lime transition-colors">
                  {nextItem.name}
                </span>
              </button>
            )}
          </div>

          {/* Page Footer */}
          <footer className="mt-16 pt-8 pb-12 border-t border-border/60 text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-fg font-heading">Forma UI</span>
              <span>— Crafted for copy & paste builders.</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-fg transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-fg transition-colors"
              >
                Twitter
              </a>
              <span className="text-muted/60">MIT License</span>
            </div>
          </footer>
        </main>

        {/* Right Column: Table of Contents & Promo Cards */}
        <RightSidebar
          activeSlug={activeSlug}
          onSelectComponent={handleSelect}
        />
      </div>

      {/* Mobile Sidebar Slide-out Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-bg border-r border-border h-full flex flex-col shadow-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2 font-heading font-bold text-fg">
                <span className="h-6 w-6 rounded bg-fg text-bg flex items-center justify-center text-xs">
                  F/
                </span>
                <span>forma ui</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-muted hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                items={registry}
                activeSlug={activeSlug}
                onSelect={handleSelect}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ⌘K Command Palette Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={registry}
        onSelect={handleSelect}
      />
    </div>
  );
}