import type { ImageBackgroundProps } from "./ImageBackground.types";

export type { ImageBackgroundProps } from "./ImageBackground.types";

const DEFAULT_IMAGE_URL = "/images/landing/creative-universe-background.jpg";

export function ImageBackground({
  imageUrl = DEFAULT_IMAGE_URL,
  className = "",
}: ImageBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none min-h-screen bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url('${imageUrl}')` }}
    />
  );
}

export default ImageBackground;
