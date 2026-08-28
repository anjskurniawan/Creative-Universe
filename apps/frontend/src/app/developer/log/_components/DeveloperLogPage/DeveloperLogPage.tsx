import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight text-[#3b4446] first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-10 border-b border-slate-200 pb-2 text-2xl font-bold text-[#3b4446]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-8 text-xl font-semibold text-[#3b4446]">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-6 text-lg font-semibold text-[#3b4446]">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-4 text-[0.9375rem] leading-7 text-slate-600">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-[#3b4446]">{children}</strong>,
  em: ({ children }) => <em className="text-slate-700">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-5 list-disc space-y-2 pl-6 text-[0.9375rem] leading-7 text-slate-600">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6 text-[0.9375rem] leading-7 text-slate-600">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-l-4 border-[#6d46eb] bg-white/70 px-5 py-3 text-slate-600">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) =>
    className?.startsWith("language-") ? (
      <code className={`${className} text-sm leading-6`} {...props}>
        {children}
      </code>
    ) : (
      <code
        className="rounded bg-violet-50 px-1.5 py-0.5 font-mono text-[0.85em] text-[#6d46eb]"
        {...props}
      >
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-5 text-sm leading-6 text-slate-100">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-100">{children}</thead>,
  th: ({ children }) => (
    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold text-[#3b4446]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-600">{children}</td>
  ),
  hr: () => <hr className="my-8 border-slate-200" />,
  a: ({ href, children }) => (
    <a
      className="font-medium text-[#6d46eb] underline decoration-violet-200 underline-offset-2 transition-colors hover:text-[#5232c7]"
      href={href}
    >
      {children}
    </a>
  ),
};

async function readAgentWorkLog() {
  const logPath = path.resolve(process.cwd(), "../../logs/logs.md");
  return fs.readFile(logPath, "utf8");
}

export default async function DeveloperLogPage() {
  const content = await readAgentWorkLog();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-5 pb-12 lg:px-10 lg:py-8">
      <article className="max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
