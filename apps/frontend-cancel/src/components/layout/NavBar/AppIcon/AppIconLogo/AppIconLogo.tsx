export default function AppIconLogo({ className = "", ariaLabel = "Creative Universe" }: { className?: string; ariaLabel?: string }) {
  return <img src="/images/landing/logo-navbar.svg" alt={ariaLabel} className={`block object-contain ${className}`} />;
}
