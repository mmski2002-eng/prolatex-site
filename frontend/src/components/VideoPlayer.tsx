"use client";

import { useEffect, useState } from "react";

/**
 * Клиентская обёртка видео: инлайн-плеер + разворот в полноэкранный оверлей.
 * Пути к файлам резолвит серверный VideoBlock (fs) и отдаёт готовыми пропсами.
 */
export default function VideoPlayer({
  videoSrc,
  posterSrc,
  title,
  autoplay = false,
}: {
  videoSrc: string;
  posterSrc?: string;
  title: string;
  autoplay?: boolean;
}) {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  return (
    <>
      <video
        data-autoplay={autoplay ? "true" : undefined}
        poster={posterSrc}
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
      {!autoplay && (
        <button
          type="button"
          className="video-expand"
          aria-label="Развернуть видео"
          onClick={() => setZoom(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      )}

      {zoom && (
        <div
          className="media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            className="media-lightbox-close"
            aria-label="Закрыть"
            onClick={() => setZoom(false)}
          >
            ✕
          </button>
          <div className="media-lightbox-body" onClick={(e) => e.stopPropagation()}>
            <video
              src={videoSrc}
              poster={posterSrc}
              controls
              autoPlay
              playsInline
              preload="metadata"
              aria-label={title}
            />
          </div>
          <div className="media-lightbox-caption">{title}</div>
        </div>
      )}
    </>
  );
}
