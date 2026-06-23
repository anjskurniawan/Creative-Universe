"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import ComponentViewer from "@/components/docs/ComponentViewer";

interface DocsContentProps {
  /** Slug from URL param, e.g. "main-app/changelogs" */
  slug: string;
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; content: string }
  | { status: "error"; message: string };

const mdComponents: Components = {
  h1: ({ children }) => <h1 className="docs-md-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="docs-md-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="docs-md-h3">{children}</h3>,
  h4: ({ children }) => <h4 className="docs-md-h4">{children}</h4>,
  p: ({ children }) => <p className="docs-md-p">{children}</p>,
  strong: ({ children }) => <strong className="docs-md-strong">{children}</strong>,
  em: ({ children }) => <em className="docs-md-em">{children}</em>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  code: ({ node, className, children, ref, ...props }) => {
    const isBlock = className?.startsWith("language-");

    if (isBlock) {
      return (
        <code className={`${className ?? ""} docs-md-code-block-inner`} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code className="docs-md-inline-code" {...props}>
        {children}
      </code>
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pre: ({ node, children, ref, ...props }) => (
    <pre className="docs-md-pre" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children }) => <blockquote className="docs-md-blockquote">{children}</blockquote>,
  ul: ({ children }) => <ul className="docs-md-ul">{children}</ul>,
  ol: ({ children }) => <ol className="docs-md-ol">{children}</ol>,
  li: ({ children }) => <li className="docs-md-li">{children}</li>,
  table: ({ children }) => (
    <div className="docs-md-table-wrapper">
      <table className="docs-md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="docs-md-thead">{children}</thead>,
  tr: ({ children }) => <tr className="docs-md-tr">{children}</tr>,
  th: ({ children }) => <th className="docs-md-th">{children}</th>,
  td: ({ children }) => <td className="docs-md-td">{children}</td>,
  hr: () => <hr className="docs-md-hr" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="docs-md-link"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

function EmptyState() {
  return (
    <div className="docs-content-empty">
      <span className="cu-material-icon docs-content-empty-icon" aria-hidden="true">
        menu_book
      </span>
      <p className="docs-content-empty-title">Pilih topik dari menu</p>
      <p className="docs-content-empty-sub">
        Klik salah satu item di menu samping untuk mulai membaca dokumentasi.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="docs-content-loading" aria-live="polite">
      <span className="docs-content-skeleton docs-content-skeleton-title" />
      <span className="docs-content-skeleton docs-content-skeleton-line" />
      <span className="docs-content-skeleton docs-content-skeleton-line short" />
      <span className="docs-content-skeleton docs-content-skeleton-line" />
      <span className="docs-content-skeleton docs-content-skeleton-line short" />
      <span className="docs-content-skeleton docs-content-skeleton-line" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="docs-content-error" role="alert">
      <span className="cu-material-icon docs-content-error-icon" aria-hidden="true">
        error_outline
      </span>
      <p className="docs-content-error-title">Gagal memuat dokumen</p>
      <p className="docs-content-error-msg">{message}</p>
      <button type="button" className="btn btn-secondary docs-content-retry-btn" onClick={onRetry}>
        Coba lagi
      </button>
    </div>
  );
}

export default function DocsContent({ slug }: DocsContentProps) {
  const [state, setState] = useState<FetchState>({ status: "idle" });

  useEffect(() => {
    if (!slug || slug === "components/navbar") {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    const url = `/docs/${slug}.md`;

    setState({ status: "loading" });

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Dokumen tidak ditemukan (${res.status}): ${url}`);
        }

        return res.text();
      })
      .then((text) => {
        if (!cancelled) setState({ status: "success", content: text });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (slug === "components/navbar") {
    return <ComponentViewer />;
  }

  if (state.status === "idle") return <EmptyState />;
  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") {
    return <ErrorState message={state.message} onRetry={() => setState({ status: "idle" })} />;
  }

  return (
    <article className="docs-md-article">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
        media="(prefers-color-scheme: light), (not (prefers-color-scheme: dark))"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        media="(prefers-color-scheme: dark)"
      />

      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={mdComponents}>
        {state.content}
      </ReactMarkdown>

      <style>{`
        .docs-md-article {
          max-width: 760px;
          padding-bottom: 5rem;
        }

        .docs-md-h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.5rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .docs-md-h2 {
          font-size: 1.375rem;
          font-weight: 650;
          color: hsl(var(--foreground));
          margin: 2.5rem 0 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid hsl(var(--border));
          letter-spacing: -0.01em;
        }

        .docs-md-h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin: 2rem 0 0.5rem;
        }

        .docs-md-h4 {
          font-size: 1rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin: 1.5rem 0 0.375rem;
        }

        .docs-md-p {
          font-size: 0.9375rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.8;
          margin: 0 0 1rem;
        }

        .docs-md-strong {
          font-weight: 650;
          color: hsl(var(--foreground));
        }

        .docs-md-em {
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        .docs-md-inline-code {
          font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
          font-size: 0.8125em;
          font-weight: 500;
          background-color: hsl(var(--secondary));
          color: hsl(var(--primary));
          border: 1px solid hsl(var(--border));
          border-radius: 4px;
          padding: 0.1em 0.4em;
        }

        .docs-md-pre {
          background-color: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.25rem 0;
          font-size: 0.84rem;
          line-height: 1.65;
          box-shadow: var(--shadow-sm);
        }

        .docs-md-pre code.hljs {
          background: transparent !important;
          padding: 0 !important;
          font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
          font-size: inherit;
        }

        .docs-md-blockquote {
          border-left: 3px solid hsl(var(--primary));
          background-color: hsl(var(--accent));
          border-radius: 0 var(--radius) var(--radius) 0;
          padding: 0.875rem 1.25rem;
          margin: 1.25rem 0;
          color: hsl(var(--accent-foreground));
        }

        .docs-md-blockquote .docs-md-p {
          margin: 0;
          color: inherit;
          font-size: 0.9rem;
        }

        .docs-md-ul,
        .docs-md-ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .docs-md-ul { list-style-type: disc; }
        .docs-md-ol { list-style-type: decimal; }

        .docs-md-li {
          font-size: 0.9375rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.7;
          padding-left: 0.25rem;
        }

        .docs-md-table-wrapper {
          overflow-x: auto;
          margin: 1.25rem 0;
          border-radius: var(--radius);
          border: 1px solid hsl(var(--border));
          box-shadow: var(--shadow-sm);
        }

        .docs-md-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .docs-md-thead {
          background-color: hsl(var(--secondary));
        }

        .docs-md-th {
          text-align: left;
          font-weight: 600;
          font-size: 0.8125rem;
          color: hsl(var(--foreground));
          padding: 0.625rem 1rem;
          white-space: nowrap;
        }

        .docs-md-tr:not(:last-child) {
          border-bottom: 1px solid hsl(var(--border));
        }

        .docs-md-tr:hover {
          background-color: hsl(var(--secondary) / 0.5);
        }

        .docs-md-td {
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          vertical-align: top;
        }

        .docs-md-hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 2rem 0;
        }

        .docs-md-link {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-color: hsl(var(--primary) / 0.35);
          transition: text-decoration-color 0.15s ease;
        }

        .docs-md-link:hover {
          text-decoration-color: hsl(var(--primary));
        }
      `}</style>
    </article>
  );
}
