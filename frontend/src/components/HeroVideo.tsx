"use client";

import { useEffect, useRef } from "react";

/**
 * Фоновое видео hero. Safari не автостартует видео с preload="none",
 * поэтому явно вызываем play() после монтирования.
 */
export default function HeroVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tryPlay = () => {
      if (!v.paused) return;
      v.play().catch(() => {});
    };

    // несколько попыток: Safari может отклонить play() до полной загрузки
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    const timer = window.setInterval(() => {
      if (!v.paused) {
        window.clearInterval(timer);
        return;
      }
      tryPlay();
    }, 700);
    const stopAt = window.setTimeout(() => window.clearInterval(timer), 8000);

    // страховка: первый жест пользователя снимает любые ограничения автоплея
    const onGesture = () => tryPlay();
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("touchstart", onGesture, { once: true });
    window.addEventListener("scroll", onGesture, { once: true, passive: true });

    return () => {
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("loadeddata", tryPlay);
      window.clearInterval(timer);
      window.clearTimeout(stopAt);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("scroll", onGesture);
    };
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
