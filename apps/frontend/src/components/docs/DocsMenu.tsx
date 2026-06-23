"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Puzzle, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocItem {
  label: string;
  slug: string;
}

interface DocSubCategory {
  label: string;
  slug?: string;
  children?: DocItem[];
}

interface DocCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  children: DocSubCategory[];
}

// ─── Static menu config ───────────────────────────────────────────────────────

const MENU_DATA: DocCategory[] = [
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    children: [
      {
        label: "Main App",
        children: [
          { label: "Changelogs", slug: "main-app/changelogs" },
        ],
      },
      {
        label: "Pricetag Generator",
        children: [
          { label: "Overview", slug: "pricetag-generator/overview" },
        ],
      },
      {
        label: "AI Agents",
        children: [
          { label: "Overview", slug: "ai-agents/overview" },
        ],
      },
    ],
  },
  {
    id: "components",
    label: "Components",
    icon: Puzzle,
    children: [
      {
        label: "Navbar",
        slug: "components/navbar",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocsMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track which section slug is currently active
  const activeSlug = searchParams.get("section") ?? "";

  // Expanded state: Set of category ids + sub-category keys (categoryId::subLabel)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSub = useCallback((key: string) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const navigateTo = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", slug);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <nav className="docs-menu" aria-label="Dokumentasi navigasi">
      {MENU_DATA.map((category) => {
        const isExpanded = expandedCategories.has(category.id);
        const Icon = category.icon;

        // A category is "active" if its id matches activeSlug OR any child slug matches
        const isCategoryActive =
          activeSlug === category.id ||
          category.children.some(
            (sub) =>
              sub.slug === activeSlug ||
              sub.children?.some((item) => item.slug === activeSlug)
          );

        return (
          <div key={category.id} className="docs-menu-category-block">
            {/* ── Category row ── */}
            <button
              type="button"
              id={`docs-cat-${category.id}`}
              aria-expanded={isExpanded}
              onClick={() => toggleCategory(category.id)}
              className={`docs-menu-category${isCategoryActive ? " active" : ""}`}
            >
              <span className="docs-menu-category-left">
                <Icon size={16} strokeWidth={2} />
                {category.label}
              </span>
              <ChevronRight
                size={14}
                className={`docs-menu-chevron${isExpanded ? " rotated" : ""}`}
              />
            </button>

            {/* ── Children ── */}
            {isExpanded && (
              <div className="docs-menu-children">
                {category.children.map((sub) => {
                  const subKey = `${category.id}::${sub.label}`;
                  const hasChildren = Array.isArray(sub.children) && sub.children.length > 0;
                  const isSubExpanded = expandedSubs.has(subKey);
                  const isSubActive = sub.slug === activeSlug;

                  return (
                    <div key={sub.label} className="docs-menu-sub-block">
                      {/* Sub-category row */}
                      {hasChildren ? (
                        <button
                          type="button"
                          id={`docs-sub-${subKey}`}
                          aria-expanded={isSubExpanded}
                          onClick={() => toggleSub(subKey)}
                          className={`docs-menu-sub${isSubActive ? " active" : ""}`}
                        >
                          <span>{sub.label}</span>
                          <ChevronRight
                            size={12}
                            className={`docs-menu-chevron${isSubExpanded ? " rotated" : ""}`}
                          />
                        </button>
                      ) : (
                        /* Sub-category that IS directly an item (no children) */
                        <button
                          type="button"
                          id={`docs-item-${sub.slug ?? subKey}`}
                          onClick={() => sub.slug && navigateTo(sub.slug)}
                          className={`docs-menu-sub${isSubActive ? " active" : ""}`}
                        >
                          <span>{sub.label}</span>
                        </button>
                      )}

                      {/* Items (level 3) */}
                      {hasChildren && isSubExpanded && (
                        <div className="docs-menu-items">
                          {sub.children!.map((item) => {
                            const isItemActive = item.slug === activeSlug;
                            return (
                              <button
                                key={item.slug}
                                type="button"
                                id={`docs-item-${item.slug.replace(/\//g, "-")}`}
                                onClick={() => navigateTo(item.slug)}
                                className={`docs-menu-item${isItemActive ? " active" : ""}`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Scoped styles */}
      <style>{`
        /* ── Shell ── */
        .docs-menu {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          padding: 1rem 0.75rem;
          width: 100%;
        }

        /* ── Category ── */
        .docs-menu-category-block {
          display: flex;
          flex-direction: column;
        }

        .docs-menu-category {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.625rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius);
          border: none;
          background: transparent;
          color: hsl(var(--foreground));
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .docs-menu-category:hover {
          background-color: hsl(var(--secondary));
        }

        .docs-menu-category.active {
          background-color: hsl(var(--foreground));
          color: hsl(var(--background));
        }

        .docs-menu-category-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* ── Chevron ── */
        .docs-menu-chevron {
          flex-shrink: 0;
          color: currentColor;
          opacity: 0.5;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .docs-menu-chevron.rotated {
          transform: rotate(90deg);
          opacity: 0.8;
        }

        /* ── Children container ── */
        .docs-menu-children {
          display: flex;
          flex-direction: column;
          margin-top: 0.125rem;
          padding-left: 0.75rem;
          border-left: 2px solid hsl(var(--border));
          margin-left: 1.25rem;
          margin-bottom: 0.25rem;
          gap: 0.125rem;
        }

        /* ── Sub-category ── */
        .docs-menu-sub-block {
          display: flex;
          flex-direction: column;
        }

        .docs-menu-sub {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          width: 100%;
          padding: 0.375rem 0.625rem;
          border-radius: calc(var(--radius) - 2px);
          border: none;
          background: transparent;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .docs-menu-sub:hover {
          color: hsl(var(--foreground));
          background-color: hsl(var(--secondary) / 0.6);
        }

        .docs-menu-sub.active {
          color: hsl(var(--foreground));
          font-weight: 700;
        }

        /* ── Items (level 3) ── */
        .docs-menu-items {
          display: flex;
          flex-direction: column;
          padding-left: 0.5rem;
          gap: 0.0625rem;
          margin-top: 0.0625rem;
          margin-bottom: 0.125rem;
        }

        .docs-menu-item {
          display: block;
          width: 100%;
          padding: 0.3125rem 0.625rem;
          border-radius: calc(var(--radius) - 2px);
          border: none;
          background: transparent;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          font-weight: 400;
          cursor: pointer;
          text-align: left;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .docs-menu-item:hover {
          color: hsl(var(--foreground));
          background-color: hsl(var(--secondary) / 0.6);
        }

        .docs-menu-item.active {
          color: hsl(var(--foreground));
          font-weight: 700;
        }
      `}</style>
    </nav>
  );
}
