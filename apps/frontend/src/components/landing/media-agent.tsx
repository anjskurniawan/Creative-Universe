interface MediaAgentProps {
  src?: string | null;
  alt?: string;
}

export function MediaAgent({ src, alt = "Creative agent" }: MediaAgentProps) {
  const isVideo = Boolean(src && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(src));

  return (
    <div className="media-agent-enter flex min-h-0 h-full w-full items-end justify-center overflow-hidden">
      {src ? (
        isVideo ? (
          <video src={src} muted autoPlay loop playsInline className="h-full w-full object-contain object-bottom" />
        ) : (
          <img src={src} alt={alt} className="h-full w-full object-contain object-bottom" />
        )
      ) : (
        <span className="text-sm text-cu-muted">Belum ada image card</span>
      )}
    </div>
  );
}
