import { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { SearchModal } from "./components/layout/SearchModal";
import { ComponentDemo } from "./components/ComponentDemo";
import { HomePage } from "./components/pages/HomePage";
import { InstallationGuide } from "./components/pages/InstallationGuide";
import { BloomLogo } from "./components/layout/BloomLogo";
import { registry } from "./data/registry";
import { getSlugFromLocation, getUrlForSlug, getTitleForSlug } from "./lib/routes";
import { X } from "lucide-react";

export default function App() {
  const [activeSlug, setActiveSlug] = useState(() => getSlugFromLocation(registry));
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

  // Sync browser title and normalize canonical URL path
  useEffect(() => {
    const canonicalPath = getUrlForSlug(activeSlug);
    if (typeof window !== "undefined" && !window.location.hash && window.location.pathname !== canonicalPath) {
      window.history.replaceState({ slug: activeSlug }, "", canonicalPath);
    }
    document.title = getTitleForSlug(activeSlug, registry);
  }, [activeSlug]);

  // Handle browser Back / Forward and direct hash changes
  useEffect(() => {
    function handleLocationChange() {
      const slug = getSlugFromLocation(registry);
      setActiveSlug(slug);
    }

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("forma-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("forma-theme", "light");
    }
  }, [isDark]);

  // Lock body scroll when mobile drawer or search is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  function handleSelect(slug) {
    if (slug !== activeSlug) {
      const targetUrl = getUrlForSlug(slug);
      window.history.pushState({ slug }, "", targetUrl);
      setActiveSlug(slug);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentIndex = registry.findIndex((item) => item.slug === activeSlug);
  const activeItem = registry[currentIndex] || registry[0];
  const prevItem = currentIndex > 0 ? registry[currentIndex - 1] : null;
  const nextItem = currentIndex < registry.length - 1 ? registry[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col font-sans selection:bg-neon-lime selection:text-black antialiased transition-colors duration-200">
      {/* Floating Capsule Header */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onNavigate={handleSelect}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSlug={activeSlug}
      />

      {/* Main 2-Column Responsive Layout with generous top clearance for floating header */}
      <div className="w-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-16 flex-1 flex gap-12 lg:gap-20 xl:gap-28 pt-8 sm:pt-14 pb-20">
        {/* Left Column: Category Navigation (Desktop) */}
        <div className="hidden lg:block">
          <Sidebar
            items={registry}
            activeSlug={activeSlug}
            onSelect={handleSelect}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        </div>

        {/* Center Column: Dynamic Content Stage */}
        <main className="flex-1 min-w-0 max-w-4xl mx-auto w-full pt-2">
          {activeSlug === "home" ? (
            <HomePage onNavigate={handleSelect} />
          ) : activeSlug === "installation" ? (
            <InstallationGuide onNavigate={handleSelect} />
          ) : (
            <>
              <ComponentDemo
                item={activeItem}
                hasPrev={!!prevItem}
                hasNext={!!nextItem}
                onPrev={() => prevItem && handleSelect(prevItem.slug)}
                onNext={() => nextItem && handleSelect(nextItem.slug)}
                onNavigate={handleSelect}
              />

              {/* Previous / Next Component Navigation Footer */}
              <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                {prevItem ? (
                  <a
                    href={getUrlForSlug(prevItem.slug)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(prevItem.slug);
                    }}
                    className="w-full sm:w-auto flex flex-col items-start p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-fg/20 transition-all text-left cursor-pointer group"
                  >
                    <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                      ← Previous
                    </span>
                    <span className="text-sm font-semibold text-fg mt-0.5 group-hover:text-neon-lime transition-colors">
                      {prevItem.name}
                    </span>
                  </a>
                ) : (
                  <a
                    href="/installation"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect("installation");
                    }}
                    className="w-full sm:w-auto flex flex-col items-start p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-fg/20 transition-all text-left cursor-pointer group"
                  >
                    <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                      ← Previous
                    </span>
                    <span className="text-sm font-semibold text-fg mt-0.5 group-hover:text-neon-lime transition-colors">
                      Installation Guide
                    </span>
                  </a>
                )}

                {nextItem && (
                  <a
                    href={getUrlForSlug(nextItem.slug)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(nextItem.slug);
                    }}
                    className="w-full sm:w-auto flex flex-col items-end p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-fg/20 transition-all text-right cursor-pointer group ml-auto"
                  >
                    <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                      Next Up →
                    </span>
                    <span className="text-sm font-semibold text-fg mt-0.5 group-hover:text-neon-lime transition-colors">
                      {nextItem.name}
                    </span>
                  </a>
                )}
              </div>
            </>
          )}

          {/* Clean Page Footer */}
          <footer className="mt-16 pt-8 border-t border-border/60 text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-fg text-sm">FunUI</span>
              <span>— Copy & paste React + Tailwind primitives.</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <a
                href="https://github.com/AzizReja10/funui"
                target="_blank"
                rel="noreferrer"
                className="hover:text-fg transition-colors"
              >
                GitHub
              </a>
              <span className="text-muted/40">•</span>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-fg transition-colors"
              >
                Twitter
              </a>
              <span className="text-muted/40">•</span>
              <span className="text-muted/60">MIT License</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-bg border-r border-border h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <BloomLogo className="w-[26px] h-[26px]" />
                <span className="font-heading text-base font-bold text-fg">FunUI</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-muted hover:text-fg hover:bg-surface cursor-pointer"
                aria-label="Close menu"
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
                isDark={isDark}
                onToggleTheme={toggleTheme}
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