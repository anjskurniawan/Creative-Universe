"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Palette, Accessibility, BookOpen, ZoomIn, ZoomOut, ChevronDown } from "lucide-react";

function PlaygroundToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-slate-400'}`}>
        <div className={`absolute top-[2px] left-[2px] bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm font-medium text-slate-700 select-none group-hover:text-slate-900 transition-colors">{label}</span>
    </label>
  );
}

function PlaygroundSelect({ label, value, options, onChange }: { label: string; value: string; options: {value: string, label: string}[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || value;
  
  return (
    <div className="flex items-center gap-2 relative">
      <span className="text-sm font-medium text-slate-700 select-none">{label}</span>
      <div className="relative">
        <button 
          type="button"
          onClick={() => setOpen(!open)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex items-center justify-between min-w-[120px] h-8 px-3 text-sm bg-white border border-slate-200 rounded-md shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <span className="truncate text-slate-700 font-medium">{selectedLabel}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden z-20 origin-top animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExampleComponentDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  
  // Responsive Playground State
  const [breakpoint, setBreakpoint] = useState<"responsive" | "sm" | "md" | "lg" | "xl" | "2xl">("responsive");
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState<"primary" | "secondary" | "outline" | "ghost" | "destructive">("primary");

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { Button } from "@/components/ui/button";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBreakpointWidth = () => {
    switch(breakpoint) {
      case "sm": return "370px";
      case "md": return "508px";
      case "lg": return "764px";
      case "xl": return "1020px";
      case "2xl": return "1276px";
      default: return "100%";
    }
  };

  const getBreakpointLabel = () => {
    if (breakpoint === "responsive") return "Responsive (100%)";
    const widthPx = parseInt(getBreakpointWidth());
    const paddingPx = breakpoint === "sm" ? 16 : 32;
    return `${breakpoint.toUpperCase()} - Total: ${widthPx}px (Workspace: ${widthPx - paddingPx}px)`;
  };

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">New Component</div>
        <h1 className="doc-hero-title">Button (Example)</h1>
        <p className="doc-hero-subtitle">
          A highly versatile button component that triggers actions or events. It supports multiple sizes, variants, and states out of the box with built-in accessibility.
        </p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      {/* ── Quick Playground ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Cobalah komponen di berbagai ukuran layar (breakpoints) dan opsi interaktif.</p>
        </div>
        
        <div className="doc-playground rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div className="doc-playground-tabs flex border-b border-slate-200">
            <button 
              className={`px-4 py-2.5 text-sm font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={`px-4 py-2.5 text-sm font-medium ${activeTab === 'code' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('code')}
            >
              Code
            </button>
          </div>
          
          {activeTab === 'preview' && (
            <div className="doc-playground-toolbar flex flex-wrap items-center justify-between gap-4 p-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Dynamic Toggles Toolbar */}
                <PlaygroundToggle 
                  label="Loading State" 
                  checked={isLoading} 
                  onChange={setIsLoading} 
                />
                
                <PlaygroundSelect 
                  label="Variant:"
                  value={variant}
                  onChange={(v) => setVariant(v as any)}
                  options={[
                    { value: "primary", label: "Primary" },
                    { value: "secondary", label: "Secondary" },
                    { value: "outline", label: "Outline" },
                    { value: "ghost", label: "Ghost" },
                    { value: "destructive", label: "Destructive" },
                  ]}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Breakpoints Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                  {(["responsive", "sm", "md", "lg", "xl", "2xl"] as const).map(bp => (
                    <button
                      key={bp}
                      onClick={() => setBreakpoint(bp)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 uppercase tracking-wide ${
                        breakpoint === bp 
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
                      }`}
                    >
                      {bp === "responsive" ? (
                        <span className="flex items-center gap-1.5 capitalize tracking-normal"><MonitorPlay size={12} /> Responsive</span>
                      ) : (
                        bp
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                  <button 
                    onClick={() => setZoom(z => Math.max(25, z - 25))} 
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded border border-transparent transition-colors" 
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button 
                    onClick={() => setZoom(100)}
                    className="px-2 text-xs font-mono font-medium text-slate-600 hover:text-blue-600 min-w-[3.5rem] text-center select-none cursor-pointer transition-colors"
                    title="Reset Zoom"
                  >
                    {zoom}%
                  </button>
                  <button 
                    onClick={() => setZoom(z => Math.min(200, z + 25))} 
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded border border-transparent transition-colors" 
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="doc-playground-content bg-slate-100 overflow-auto flex justify-center items-start min-h-[400px] relative">
            {activeTab === 'preview' ? (
              <div className="w-full flex justify-center p-8 min-h-full" style={{ 
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", 
                  backgroundSize: "20px 20px" 
              }}>
                <div 
                  className="transition-all duration-300 ease-in-out border border-slate-200 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden"
                  style={{
                    width: getBreakpointWidth(),
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                    marginBottom: `${Math.max(0, (zoom - 100) * 2)}px` // Prevent clipping when zoomed in
                  }}
                >
                  <div className="w-full h-8 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-[10px] font-mono text-slate-400">
                     {getBreakpointLabel()}
                  </div>
                  <div className={`${breakpoint === "sm" ? "p-2" : "p-4"} w-full flex flex-col sm:flex-row items-center justify-center gap-6`}>
                     <button className={`example-btn ${variant}`}>
                       {isLoading ? "Loading..." : "Click Me"}
                     </button>
                     <button className="example-btn secondary" disabled={isLoading}>Secondary</button>
                     <button className="example-btn outline" disabled={isLoading}>Outline</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="doc-code-area w-full p-6 bg-[#0f172a] text-slate-50 overflow-x-auto text-sm">
                <pre>
                  <code>
{`<Button variant="${variant}"${isLoading ? " isLoading" : ""}>
  ${isLoading ? "Loading..." : "Click Me"}
</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>`}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Installation ── */}
      <section className="doc-section">
        <h2 className="doc-section-title">Installation & Usage</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header">
            <span>File Location</span>
          </div>
          <div className="doc-install-body text-cu-muted">
            <code>apps/frontend/src/path/to/component.tsx</code>
          </div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header">
            <span>Terminal</span>
          </div>
          <div className="doc-install-body">
            <code>npm install @creative/ui-button</code>
          </div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span>Import Statement</span>
            <button onClick={handleCopy} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body">
            <code>import {'{ Button }'} from "@/components/ui/button";</code>
          </div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Copy and paste this code into your project to use the component.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/ui/button.tsx</span>
            <button onClick={() => {
              navigator.clipboard.writeText('import React from "react";\nimport { cva, type VariantProps } from "class-variance-authority";\nimport { cn } from "@/utils/tailwind";\n\n// ... full source code');
            }} className="copy-btn">
              <Copy size={14} />
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre>
              <code>
{`import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/tailwind";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Variants</h2>
          <p className="doc-section-desc">The component comes with several semantic variants.</p>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-preview">
               <button className="example-btn primary">Primary</button>
            </div>
            <div className="doc-grid-info">
              <h3>Primary</h3>
              <p>Used for the main action on a page. Should only appear once per view.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-preview">
               <button className="example-btn destructive">Destructive</button>
            </div>
            <div className="doc-grid-info">
              <h3>Destructive</h3>
              <p>Used for actions that result in data loss or cannot be undone.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-preview">
               <button className="example-btn ghost">Ghost</button>
            </div>
            <div className="doc-grid-info">
              <h3>Ghost</h3>
              <p>Used for secondary actions that shouldn't compete for attention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Props API ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><BookOpen size={18} className="inline-icon" /> API Reference</h2>
          <p className="doc-section-desc">Complete list of props and their expected types.</p>
        </div>
        
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>variant</code></td>
                <td><code className="type">"primary" | "secondary" | "outline" | "ghost" | "destructive"</code></td>
                <td><code>"primary"</code></td>
                <td>Visual style variant of the button.</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code className="type">"sm" | "md" | "lg" | "icon"</code></td>
                <td><code>"md"</code></td>
                <td>Controls the padding and font size.</td>
              </tr>
              <tr>
                <td><code>isLoading</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>If true, shows a spinner and disables interaction.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Native disabled state. Overrides interaction.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
