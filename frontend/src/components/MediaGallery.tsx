"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  label?: string;
}

/**
 * Листаемая галерея карточки товара: фото и видео в одном окне,
 * переключение миниатюрами, стрелками и свайпом; клик по фото —
 * полноэкранный просмотр (как в карточках mrmattress).
 */
export default function MediaGallery({
  items,
  aspect = "4/3",
}: {
  items: GalleryItem[];
  aspect?: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);
  const current = items[index];

  const go = useCallback(
    (delta: number) =>
      setIndex((i) => (i + delta + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom, go]);

  if (!current) return null;

  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      touchX.current = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    },
  };

  const media = (inZoom: boolean) =>
    current.type === "image" ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={current.src} alt={current.alt} width={900} height={800} />
    ) : (
      <video
        key={`${current.src}${inZoom ? "-zoom" : ""}`}
        src={current.src}
        poster={current.poster}
        controls
        playsInline
        preload="metadata"
        aria-label={current.alt}
      />
    );

  const navButtons = (
    <>
      <button
        type="button"
        className="media-gallery-nav prev"
        aria-label="Предыдущее"
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
      >
        ‹
      </button>
      <button
        type="button"
        className="media-gallery-nav next"
        aria-label="Следующее"
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
      >
        ›
      </button>
    </>
  );

  return (
    <div className="media-gallery">
      <div
        className={`media-gallery-main${current.type === "image" ? " zoomable" : ""}`}
        style={{ aspectRatio: aspect }}
        onClick={() => current.type === "image" && setZoom(true)}
        {...swipeHandlers}
      >
        {media(false)}
        {current.type === "image" && (
          <span className="media-gallery-zoom-hint" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </span>
        )}
        {items.length > 1 && navButtons}
        {items.length > 1 && (
          <div className="media-gallery-dots" aria-hidden="true">
            {items.map((item, i) => (
              <span key={item.src} className={i === index ? "active" : ""} />
            ))}
          </div>
        )}
      </div>
      {items.length > 1 && (
        <div className="media-gallery-thumbs" role="tablist" aria-label="Медиа товара">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`media-gallery-thumb${i === index ? " active" : ""}`}
              onClick={() => setIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.type === "video" ? (item.poster ?? "") : item.src}
                alt=""
                width={160}
                height={140}
                loading="lazy"
              />
              {item.type === "video" && (
                <span className="media-gallery-play" aria-hidden="true">▶</span>
              )}
              {item.label && <span className="media-gallery-label">{item.label}</span>}
            </button>
          ))}
        </div>
      )}
      {zoom && (
        <div
          className="media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setZoom(false)}
          {...swipeHandlers}
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
            {media(true)}
          </div>
          {items.length > 1 && navButtons}
          <div className="media-lightbox-caption">
            {current.label ?? current.alt}
            {items.length > 1 && ` · ${index + 1} / ${items.length}`}
          </div>
        </div>
      )}
    </div>
  );
}
