import React from "react";
import { AuthCardHeader } from "./AuthCardHeader";
import { AuthCardFooter } from "./AuthCardFooter";
import type { AuthCardProps } from "./AuthCard.types";

export type { AuthCardProps } from "./AuthCard.types";

export function AuthCard({
  title,
  footerText,
  showCloseButton = false,
  headerButtonIcon,
  headerButtonAriaLabel,
  onHeaderButtonClick,
  children,
  className = "",
}: AuthCardProps) {
  return (
    <div
      className={`cu-style bg-white border border-divider rounded-[16px] shadow-[0px_8px_12px_rgba(0,0,0,0.15)] flex flex-col items-start w-full max-w-[450px] overflow-visible transition-all duration-300 relative z-10 ${className}`.trim()}
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

export default AuthCard;
