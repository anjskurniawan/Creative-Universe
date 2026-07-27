"use client";

export default function ViewportDebug({ viewport }: { viewport?: string }) {
  return (
    <div className="fixed top-2 right-2 z-[9999] bg-black text-white text-xs px-3 py-2 rounded-md font-mono">
      <p>
        Prop viewport: <b>{viewport ?? "undefined"}</b>
      </p>
      <p className="block lg:hidden text-yellow-400">CSS aktual: MOBILE</p>
      <p className="hidden lg:block text-green-400">CSS aktual: DESKTOP</p>
    </div>
  );
}
