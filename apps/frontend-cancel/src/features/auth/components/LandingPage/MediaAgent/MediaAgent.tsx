import Image from "next/image";

export default function MediaAgent({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return <div className="flex h-full items-end justify-center text-sm text-slate-400">Belum ada image card</div>;
  return <div className="media-agent-enter flex h-full w-full items-end justify-center">{/\.(mp4|webm|ogg)(?:\?.*)?$/i.test(src) ? <video src={src} muted autoPlay loop playsInline className="h-full w-full object-contain object-bottom" /> : <Image src={src} alt={alt} width={700} height={700} className="h-full w-full object-contain object-bottom" unoptimized />}</div>;
}
