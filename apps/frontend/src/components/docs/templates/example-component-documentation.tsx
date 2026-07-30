import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Palette, Accessibility, BookOpen } from "lucide-react";

export function ExampleComponentDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { Button } from "@/components/ui/button";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <p className="doc-section-desc">Try out the component in real-time before using it.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button 
              className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Code
            </button>
          </div>
          
          <div className="doc-playground-content">
            {activeTab === 'preview' ? (
              <div className="doc-preview-area">
                <button className="example-btn primary">Click Me</button>
                <button className="example-btn secondary">Secondary</button>
                <button className="example-btn outline">Outline</button>
              </div>
            ) : (
              <div className="doc-code-area">
                <pre>
                  <code>
{`<Button variant="primary">Click Me</Button>
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
              navigator.clipboard.writeText('import React from "react";\\nimport { cva, type VariantProps } from "class-variance-authority";\\nimport { cn } from "@/utils/tailwind";\\n\\n// ... full source code');
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
