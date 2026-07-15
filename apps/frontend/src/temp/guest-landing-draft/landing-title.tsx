export interface LandingTitleProps {
  children: string;
}

export function LandingTitle({ children }: LandingTitleProps) {
  return (
    <h1 className="max-w-6xl text-center text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-cu-ink md:text-7xl lg:text-8xl">
      {children}
    </h1>
  );
}
