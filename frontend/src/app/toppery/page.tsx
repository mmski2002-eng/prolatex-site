import type { Metadata } from "next";
import Link from "next/link";
import { getToppersData } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoBlock from "@/components/VideoBlock";
import LeadForm from "@/components/LeadForm";
import MediaGallery from "@/components/MediaGallery";
import { priceFrom } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "Тонкий латексный матрас — купить наматрасник из латекса, цены" },
  description:
    "Тонкие матрасы из листового латекса Про-Латекс по технологии Dunlop: толщина 20–50 мм, плотность 55/65 кг/м³, Solid/микроперфорация/7-зонная перфорация, охлаждающая гелевая опция.",
  alternates: { canonical: "/toppery/" },
  openGraph: ogMeta({ url: "/toppery/" }),
};

export default async function TopperyPage() {
  const data = await getToppersData();

  return (
    <>
      <Breadcrumbs items={[{ name: "Тонкие матрасы", path: "/toppery/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Тонкий латексный матрас из листового латекса</h1>
          <p className="lead">{data.intro}</p>
        </div>
      </section>

      <section className="tint" aria-label="Варианты тонких матрасов Dunlop">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Модели</div>
            <h2>Варианты тонких матрасов</h2>
            <p>Четыре модели толщиной от 20 до 50 мм.</p>
          </div>
          <div className="grid-2">
            {(data.models ?? []).map((m) => (
              <div className="cell pillow-card" key={m.slug}>
                <MediaGallery
                  aspect="16/10"
                  items={m.images.map((img) => ({
                    type: "image" as const,
                    src: img.src,
                    alt: `Тонкий матрас ${m.name} ${m.thickness_mm} мм — ${img.label.toLowerCase()}`,
                    label: img.label,
                  }))}
                />
                <h3>{m.name}</h3>
                <p className="pillow-subtitle">Толщина {m.thickness_mm} мм</p>
                <div style={{ flex: 1 }}>
                  <p className="mt-8" style={{ color: "var(--gray)", fontSize: 14 }}>
                    {m.summary}
                  </p>
                </div>
                {m.price_from && <div className="model-price mt-16">{priceFrom(m.price_from)}</div>}
                <div className="spec-table mt-16">
                  <div className="spec-row">
                    <span>Толщина</span>
                    <b>{m.thickness_mm} мм</b>
                  </div>
                  {data.densities.map((d) => (
                    <div className="spec-row" key={d.kg_m3}>
                      <span>Плотность {d.name.toLowerCase()}</span>
                      <b>{d.kg_m3} кг/м³</b>
                    </div>
                  ))}
                  {!m.price_from && (
                    <div className="spec-row">
                      <span>Цена</span>
                      <b>По запросу</b>
                    </div>
                  )}
                </div>
                <a href="#topper-lead" className="btn btn-sand btn-block" style={{ marginTop: 16 }}>
                  Запросить цену
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Технология">
        <div className="wrap">
          <div className="grid-2">
            <div className="cell">
              <h3>Технология</h3>
              <p className="mt-8">{data.technology}</p>
            </div>
            <div className="cell">
              <h3>Состав</h3>
              <p className="mt-8">{data.blend}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tint" aria-label="Толщина и плотность">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Параметры</div>
            <h2>Толщина и плотность тонкого матраса</h2>
          </div>
          <div className="grid-2">
            <div className="cell">
              <h3>Толщина</h3>
              <p className="mt-8">{data.thickness_mm.join(" / ")} мм</p>
            </div>
            <div className="cell">
              <h3>Плотность</h3>
              <ul className="list-check mt-8">
                {data.densities.map((d) => (
                  <li key={d.kg_m3}>{d.kg_m3} кг/м³ — {d.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Поверхность">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Поверхность</div>
            <h2>Три вида перфорации</h2>
          </div>
          <div className="grid-3">
            {data.surface_options.map((s) => (
              <div className="cell" key={s.slug}>
                <h3>{s.name}</h3>
                <p className="mt-8">{s.description}</p>
              </div>
            ))}
          </div>
          {data.addons.map((a) => (
            <div
              className="cell mt-24"
              key={a.slug}
              style={{
                border: "1px solid var(--line)",
                display: "grid",
                gridTemplateColumns: "minmax(140px, 220px) 1fr",
                gap: 20,
                alignItems: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/mattress/topper-gelpulse.webp"
                alt={`Латекс ${a.name} — макросъёмка структуры из техпаспорта`}
                width={900}
                height={760}
                loading="lazy"
                style={{ width: "100%", height: "auto", borderRadius: "var(--radius)" }}
              />
              <div>
                <h3>{a.name}</h3>
                <p className="mt-8">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tint" aria-label="Видео производства">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Производство</div>
            <h2>Как делают листовой латекс</h2>
          </div>
          <VideoBlock filename="Novaya-Sheets-Video-V4.mp4" title="Производство листового латекса Dunlop" />
        </div>
      </section>

      <section aria-label="Размеры">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Размеры</div>
            <h2>Доступные размеры тонких матрасов</h2>
            <p>{data.sizes_note} Латекс поставляется в рулонах длиной до {data.roll_length_m} метров.</p>
          </div>
          {data.widths_cm && data.lengths_cm && (
            <ul className="size-chip-row">
              {data.lengths_cm.flatMap((l) =>
                data.widths_cm!.map((w) => (
                  <li className="size-chip" key={`${w}x${l}`}>
                    {w}×{l} см
                  </li>
                ))
              )}
            </ul>
          )}
          <p style={{ color: "var(--gray)" }}>
            Хотите обновить старый матрас без замены — читайте статью{" "}
            <Link href="/blog/topper-iz-lateksa/" style={{ color: "var(--sand-deep)", fontWeight: 700 }}>
              «Тонкий латексный матрас: обновить спальное место без замены»
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cta-section" id="topper-lead" aria-label="Заявка">
        <div className="wrap cta-grid">
          <div>
            <h2>Заказать тонкий матрас под ваш размер</h2>
            <p>Укажите толщину, плотность и размер матраса — рассчитаем стоимость раскроя.</p>
          </div>
          <LeadForm
            source="toppery-page"
            commentPlaceholder="Например: толщина 5 см, размер 160×200, плотность Dunlop Classic"
          />
        </div>
      </section>
    </>
  );
}
