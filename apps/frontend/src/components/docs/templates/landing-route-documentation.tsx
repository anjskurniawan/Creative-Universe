import React from "react";
import { Check, Copy, FileCode2, Info, Navigation, PlayCircle } from "lucide-react";

export function LandingRouteDocumentation() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`// Refer to apps/frontend/src/app/page.tsx`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="doc-route-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Route</div>
        <h1 className="doc-hero-title">Landing Page (/)</h1>
        <p className="doc-hero-subtitle">
          The main entry point of the Creative Universe application. It smartly handles routing logic based on the user's authentication state, serving both as a public greeting and a personalized dashboard gateway.
        </p>
        <div className="doc-hero-links">
          <span className="doc-link-item"><Navigation size={14} /> Path: <code>/</code></span>
          <span className="doc-link-item"><FileCode2 size={14} /> <code>app/page.tsx</code></span>
        </div>
      </header>

      {/* ── Architecture & Logic ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Info size={18} className="inline-icon" /> Architecture & Logic</h2>
          <p className="doc-section-desc">How the route processes incoming users.</p>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>1. Authentication Check</h3>
              <p>Uses the <code>useAuth()</code> hook to determine if the user is <code>isLoading</code>, <code>isAuthenticated</code>, or a guest.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>2. GSAP Animations</h3>
              <p>Utilizes GSAP to create a cinematic, slow-zooming background effect that respects <code>prefers-reduced-motion</code>.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>3. Delayed Interactions</h3>
              <p>Coordinates the appearance of the primary Call-To-Action (CTA) only after the <code>HeroHeading</code> has finished typing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── UI States ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><PlayCircle size={18} className="inline-icon" /> Render States</h2>
          <p className="doc-section-desc">The component conditionally renders three distinct UI states.</p>
        </div>
        
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>State</th>
                <th>Condition</th>
                <th>Rendered Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Loading</strong></td>
                <td><code>isLoading === true</code></td>
                <td>A static background image without any text, preventing layout shift while auth state resolves.</td>
              </tr>
              <tr>
                <td><strong>Authenticated</strong></td>
                <td><code>isAuthenticated === true</code></td>
                <td>Shows the <code>Navbar</code> (brand hidden) and a personalized welcome message introducing the Creative Universe ecosystem.</td>
              </tr>
              <tr>
                <td><strong>Guest (Public)</strong></td>
                <td><code>isAuthenticated === false</code></td>
                <td>The cinematic public landing page with an animated background and a <code>PrimaryActionLink</code> to the login page.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Core Implementation Snippet ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><FileCode2 size={18} className="inline-icon" /> Core Implementation</h2>
          <p className="doc-section-desc">The exact conditional routing block from the source file.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">apps/frontend/src/app/page.tsx</span>
            <button onClick={handleCopy} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre>
              <code>
{`export default function GuestLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [isPrimaryActionVisible, setIsPrimaryActionVisible] = useState(false);

  // ... useEffect hooks for GSAP animations and typing delays

  // 1. Loading State
  if (isLoading) {
    return <div className="min-h-screen bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover" />;
  }

  // 2. Authenticated State
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar hideBrand />
        <main className="flex flex-1 flex-col justify-center px-4">
          <HeroHeading typing onTypingComplete={completeTyping}>
            Creative Universe
          </HeroHeading>
          {/* Dashboard introduction text */}
        </main>
      </div>
    );
  }

  // 3. Guest State
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#16001f]">
      {/* Animated GSAP Background */}
      <div ref={backgroundRef} className="absolute inset-0 bg-[url('/images/landing/creative-universe-background.jpg')]" />
      
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <HeroHeading typing onTypingComplete={completeTyping}>
          This is Where Creative Begins
        </HeroHeading>
        {isPrimaryActionVisible && (
          <PrimaryActionLink href={APP_ROUTES.login}>Masuk ke Universe</PrimaryActionLink>
        )}
      </main>
    </div>
  );
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── Dependencies ── */}
      <section className="doc-section">
        <h2 className="doc-section-title">Dependencies</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header">
            <span>External Libraries</span>
          </div>
          <div className="doc-install-body">
            <code>gsap</code> (For complex background animations)
          </div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header">
            <span>Internal Modules</span>
          </div>
          <div className="doc-install-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div><code>@/providers/auth-provider</code> (useAuth)</div>
            <div><code>@/core/navigation/routes</code> (APP_ROUTES)</div>
            <div><code>@/components/typography/hero-heading</code></div>
            <div><code>@/components/ui/primary-action-link</code></div>
          </div>
        </div>
      </section>
    </div>
  );
}
