/**
 * Routing helpers for FunUI.
 * Supports clean HTML5 paths (/components/:slug, /installation, /),
 * direct slugs (/typewriter), and hash routes (#/components/typewriter).
 */

export function getSlugFromLocation(items = []) {
  if (typeof window === "undefined") return "home";

  // Check hash first (e.g. #/components/typewriter, #/installation, #typewriter)
  const hash = window.location.hash.replace(/^#\/?/, "").trim();
  // Check pathname (e.g. /components/typewriter, /typewriter, /installation)
  const pathname = window.location.pathname.replace(/^\/+/, "").replace(/\/+$/, "").trim();

  const candidate = (hash || pathname).toLowerCase();
  if (!candidate || candidate === "home") return "home";
  if (candidate === "installation" || candidate === "install") return "installation";

  // Check if starts with "components/"
  const componentSlug = candidate.startsWith("components/")
    ? candidate.slice("components/".length)
    : candidate;

  // Search in registry items
  const match = items.find(
    (item) => item.slug.toLowerCase() === componentSlug.toLowerCase()
  );
  if (match) return match.slug;

  const directMatch = items.find(
    (item) => item.slug.toLowerCase() === candidate.toLowerCase()
  );
  if (directMatch) return directMatch.slug;

  return "home";
}

export function getUrlForSlug(slug) {
  if (!slug || slug === "home") return "/";
  if (slug === "installation") return "/installation";
  return `/components/${slug}`;
}

export function getTitleForSlug(slug, items = []) {
  if (!slug || slug === "home") {
    return "FunUI — Modern UI Primitives & Blocks";
  }
  if (slug === "installation") {
    return "Installation Guide — FunUI";
  }
  const item = items.find((i) => i.slug === slug);
  return item ? `${item.name} — FunUI` : "FunUI";
}
