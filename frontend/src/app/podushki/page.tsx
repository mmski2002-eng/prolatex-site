import type { Metadata } from "next";
import { getPillowsData } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";
import VideoBlock from "@/components/VideoBlock";
import HeroVideo from "@/components/HeroVideo";
import MediaGallery from "@/components/MediaGallery";

export const metadata: Metadata = {
  title: { absolute: "Латексные подушки: купить подушку из латекса, цены" },
  description:
    "Латексные подушки Про-Латекс: пять готовых моделей — классические Soap и анатомические Ergo. Составы Dunlop Classic и Natural, три жёсткости. Цена по запросу.",
  alternates: { canonical: "/podushki/" },
  openGraph: ogMeta({ url: "/podushki/" }),
};

export default async function PodushkiPage() {
  const data = await getPillowsData();

  return (
    <>
      <Breadcrumbs items={[{ name: "Подушки", path: "/podushki/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap pillow-hero">
          <div>
            <h1 className="page-h1">Латексные подушки</h1>
            <p className="lead">{data.intro}</p>
          </div>
          <div className="pillow-hero-video" aria-label="Видео: как делают латексные подушки">
            <HeroVideo
              src="/video/pillows-square.mp4"
              poster="/video/posters/pillows-square.jpg"
            />
            <span className="pillow-hero-video-caption">Производство латексных подушек</span>
          </div>
        </div>
      </section>

      {data.retail_line && data.retail_line.models.length > 0 && (
        <section className="tint" aria-label={data.retail_line.title}>
          <div className="wrap">
            <div className="section-head">
              <div className="section-tag">Готовая линейка</div>
              <h2>{data.retail_line.title}</h2>
              <p>{data.retail_line.description}</p>
            </div>
            <div className="grid-3">
              {data.retail_line.models.map((m) => {
                return (
                  <div className="cell pillow-card" key={m.name}>
                    <MediaGallery
                      aspect="4/3"
                      items={[
                        ...(m.image
                          ? [{ type: "image" as const, src: m.image, alt: `Латексная подушка ${m.name} в чехле`, label: "В чехле" }]
                          : []),
                        ...(m.image_latex
                          ? [{ type: "image" as const, src: m.image_latex, alt: `Подушка ${m.name} без чехла`, label: "Латекс" }]
                          : []),
                        ...(m.image_cutaway
                          ? [{ type: "image" as const, src: m.image_cutaway, alt: `Подушка ${m.name} — латексный наполнитель под снятым чехлом`, label: "Наполнитель" }]
                          : []),
                        {
                          type: "video" as const,
                          src: "/video/pillows-square.mp4",
                          poster: "/video/posters/pillows-square.jpg",
                          alt: `Видео производства латексных подушек`,
                          label: "Видео",
                        },
                      ]}
                    />
                    <h3>{m.name}</h3>
                    {m.subtitle && (
                      <p className="pillow-subtitle">{m.subtitle}</p>
                    )}
                    {m.description && (
                      <p className="mt-8" style={{ color: "var(--gray)", fontSize: 14, flex: 1 }}>
                        {m.description}
                      </p>
                    )}
                    <div className="spec-table mt-16">
                      <div className="spec-row">
                        <span>Размер</span>
                        <b>
                          {m.length_mm / 10}×{m.width_mm / 10}×
                          {m.height_mm / 10} см
                        </b>
                      </div>
                      {m.material && (
                        <div className="spec-row">
                          <span>Состав</span>
                          <b>{m.material}</b>
                        </div>
                      )}
                      {m.firmness_options && (
                        <div className="spec-row">
                          <span>Жёсткости</span>
                          <b>{m.firmness_options}</b>
                        </div>
                      )}
                      <div className="spec-row">
                        <span>Упаковка</span>
                        <b>{m.packaging}</b>
                      </div>
                      <div className="spec-row">
                        <span>Цена</span>
                        <b>По запросу</b>
                      </div>
                    </div>
                    <a
                      href="#pillow-lead"
                      className="btn btn-sand btn-block"
                      style={{ marginTop: 16 }}
                    >
                      Узнать цену
                    </a>
                    <a href="#pillow-video" className="pillow-video-link">
                      ▶ Видео: как делают латексные подушки
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section aria-label="Составы">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Составы</div>
            <h2>Dunlop Classic и Dunlop Natural</h2>
          </div>
          <div className="grid-2">
            {data.blends.map((b) => (
              <div className="cell" key={b.slug}>
                <h3>{b.name}</h3>
                <p className="mt-8">{b.description}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 24, color: "var(--gray)" }}>
            Доступные уровни жёсткости: {data.firmness_options.join(", ")}.
          </p>
        </div>
      </section>

      <section className="tint" id="pillow-video" aria-label="Видео производства">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Производство</div>
            <h2>Как делают латексные подушки</h2>
          </div>
          <VideoBlock filename="Novaya-Pillows-Video-V4.mp4" title="Производство латексных подушек Про-Латекс" />
        </div>
      </section>

      

      <section id="pillow-lead" aria-label="Заявка">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Заявка</div>
            <h2>Подобрать латексную подушку</h2>
            <p>Оставьте заявку — поможем выбрать модель, состав и жёсткость под вашу позу сна и назовём цену.</p>
          </div>
          <div style={{ maxWidth: 560 }}>
            <LeadForm
              source="podushki-page"
              title="Узнать цену подушки"
              subtitle="Укажите в комментарии модель (EasyPillow, SleepSoft, PillowEase, BreathSoft или BreezePillow) — ответим с точной ценой."
            />
          </div>
        </div>
      </section>
    </>
  );
}
