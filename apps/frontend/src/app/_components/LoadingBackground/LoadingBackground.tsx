import type { LoadingBackgroundProps } from "./LoadingBackground.types";

export type { LoadingBackgroundProps } from "./LoadingBackground.types";
export type { ImageBackgroundProps } from "./LoadingBackground.types";

const DEFAULT_IMAGE_URL = "/images/landing/creative-universe-background.jpg";

export function LoadingBackground({
  imageUrl = DEFAULT_IMAGE_URL,
  className = "",
}: LoadingBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none min-h-screen bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url('${imageUrl}')` }}
    />
  );
}

// Backward-compatible alias
export const ImageBackground = LoadingBackground;

export default LoadingBackground;
