import { resolveVideo } from "@/lib/media";

export default function VideoBlock({
  filename,
  title,
  autoplay = false,
}: {
  filename: string;
  title: string;
  autoplay?: boolean;
}) {
  const { videoSrc, posterSrc } = resolveVideo(filename);

  if (!videoSrc && !posterSrc) {
    return (
      <div className="video-block">
        <div className="video-fallback">{title}</div>
      </div>
    );
  }

  return (
    <div className="video-block">
      {videoSrc ? (
        <video
          data-autoplay={autoplay ? "true" : undefined}
          poster={posterSrc ?? undefined}
          controls={!autoplay}
          autoPlay={autoplay}
          muted={autoplay}
          loop={autoplay}
          playsInline
          preload="none"
          aria-label={title}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={posterSrc ?? undefined} alt={title} loading="lazy" />
      )}
      <span className="video-caption">{title}</span>
    </div>
  );
}
