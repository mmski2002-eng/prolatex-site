import type { Metadata } from "next";
import { getContentData } from "@/lib/api";
import {videoObjectJsonLd, ogMeta } from "@/lib/seo";
import { resolveVideo } from "@/lib/media";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoBlock from "@/components/VideoBlock";
import OriginBadge from "@/components/OriginBadge";

export const metadata: Metadata = {
  title: "Производство латекса Novaya — видео с завода",
  description:
    "Видеогалерея производства натурального латекса: плантации гевеи, вспенивание, вулканизация, контроль качества и логистика на заводе Novaya.",
  alternates: { canonical: "/proizvodstvo/" },
  openGraph: ogMeta({ url: "/proizvodstvo/" }),
};

export default async function ProizvodstvoPage() {
  const content = await getContentData();
  const videos = content.production_videos.filter(
    (v) => v.section === "proizvodstvo"
  );
  const mainVideo = videos[0];
  const mainResolved = mainVideo ? resolveVideo(mainVideo.file) : null;

  return (
    <>
      <Breadcrumbs items={[{ name: "Производство", path: "/proizvodstvo/" }]} />
      {mainVideo && mainResolved?.videoSrc && (
        <JsonLd
          data={videoObjectJsonLd({
            name: mainVideo.title,
            description: `Видео производства натурального латекса Про-Латекс: ${mainVideo.title}.`,
            thumbnailUrl: mainResolved.posterSrc ?? "/logo-400.png",
            contentUrl: mainResolved.videoSrc,
            uploadDate: "2025-01-01",
          })}
        />
      )}
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <OriginBadge />
          <h1 className="page-h1">Производство латекса Novaya</h1>
          <p className="lead">
            От плантаций гевеи до готового блока латекса — путь материала на
            европейском производстве, где делают латекс для матрасов,
            подушек и тонких матрасов Про-Латекс.
          </p>
        </div>
      </section>

      <section aria-label="Видео завода">
        <div className="wrap">
          <div className="video-gallery">
            {videos.map((v) => (
              <VideoBlock key={v.file} filename={v.file} title={v.title} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
