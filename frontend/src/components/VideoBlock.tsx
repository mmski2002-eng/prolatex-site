import { resolveVideo } from "@/lib/media";
import VideoPlayer from "./VideoPlayer";

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
        <VideoPlayer
          videoSrc={videoSrc}
          posterSrc={posterSrc ?? undefined}
          title={title}
          autoplay={autoplay}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={posterSrc ?? undefined} alt={title} loading="lazy" />
      )}
      <span className="video-caption">{title}</span>
    </div>
  );
}
