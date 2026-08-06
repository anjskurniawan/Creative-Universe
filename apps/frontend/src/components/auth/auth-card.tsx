import React from "react";
import { AuthCardHeader } from "./auth-card-header";
import { AuthCardFooter } from "./auth-card-footer";

export interface AuthCardProps {
  title: string;
  footerText: string;
  showCloseButton?: boolean;
  headerButtonIcon?: string;
  headerButtonAriaLabel?: string;
  onHeaderButtonClick?: () => void;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  footerText,
  showCloseButton = false,
  headerButtonIcon,
  headerButtonAriaLabel,
  onHeaderButtonClick,
  children,
}: AuthCardProps) {
  return (
    <div
      className="bg-white border border-divider rounded-[16px] shadow-[0px_8px_12px_rgba(0,0,0,0.15)] flex flex-col items-start w-full max-w-[450px] overflow-visible transition-all duration-300 relative z-10"
      id="auth-card-container"
    >
      {/* Header Kartu */}
      <AuthCardHeader
        title={title}
        showCloseButton={showCloseButton}
        buttonIcon={headerButtonIcon}
        buttonAriaLabel={headerButtonAriaLabel}
        onButtonClick={onHeaderButtonClick}
      />

      {/* Body Kartu */}
      {children}

      {/* Footer Kartu */}
      <AuthCardFooter text={footerText} />
    </div>
  );
}
