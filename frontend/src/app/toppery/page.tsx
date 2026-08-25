import type { Metadata } from "next";
import Link from "next/link";
import { getToppersData } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoBlock from "@/components/VideoBlock";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: { absolute: "Латексный топпер — купить наматрасник из латекса, цены" },
  description:
    "Топперы из листового латекса Про-Латекс по технологии Pulse: толщина 30–60 мм, плотность 55/65 кг/м³, Solid/микроперфорация/7-зонная перфорация, GelPulse.",
  alternates: { canonical: "/toppery/" },
  openGraph: ogMeta({ url: "/toppery/" }),
};

export default async function TopperyPage() {
  const data = await getToppersData();

  return (
    <>
      <Breadcrumbs items={[{ name: "Топперы", path: "/toppery/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Латексный топпер из листового латекса Pulse</h1>
          <p className="lead">{data.intro}</p>
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
            <h2>Толщина и плотность топпера</h2>
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

          <div className="section-head" style={{ marginTop: 56 }}>
            <h2 style={{ fontSize: "clamp(22px, 2.4vw, 30px)" }}>
              Варианты топперов Pulse
            </h2>
            <p>Восемь базовых позиций: любая толщина в двух плотностях. Раскрой под ваш размер матраса.</p>
          </div>
          <div className="grid-4">
            {data.thickness_mm.flatMap((mm) =>
              data.densities.map((d) => (
                <div className="cell" key={`${mm}-${d.kg_m3}`}>
                  <h3>Топпер {mm} мм</h3>
                  <p className="mt-8" style={{ color: "var(--gray)" }}>
                    Плотность {d.kg_m3} кг/м³ ({d.name.toLowerCase()})
                  </p>
                  <div className="spec-table mt-16">
                    <div className="spec-row">
                      <span>Цена</span>
                      <b>По запросу</b>
                    </div>
                  </div>
                  <a href="#topper-lead" className="btn btn-outline btn-block" style={{ marginTop: 14 }}>
                    Запросить цену
                  </a>
                </div>
              ))
            )}
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
            <h2>Как делают листовой латекс Pulse</h2>
          </div>
          <VideoBlock filename="Novaya-Sheets-Video-V4.mp4" title="Производство листового латекса Pulse" />
        </div>
      </section>

      <section aria-label="Размеры">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Размеры</div>
            <h2>Раскрой в любой размер</h2>
            <p>{data.sizes_note} Латекс поставляется в рулонах длиной до {data.roll_length_m} метров.</p>
          </div>
          <p style={{ color: "var(--gray)" }}>
            Хотите обновить старый матрас без замены — читайте статью{" "}
            <Link href="/blog/topper-iz-lateksa/" style={{ color: "var(--sand-deep)", fontWeight: 700 }}>
              «Латексный топпер: обновить матрас без замены»
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cta-section" id="topper-lead" aria-label="Заявка">
        <div className="wrap cta-grid">
          <div>
            <h2>Заказать топпер под ваш размер</h2>
            <p>Укажите толщину, плотность и размер матраса — рассчитаем стоимость раскроя.</p>
          </div>
          <LeadForm source="toppery-page" />
        </div>
      </section>
    </>
  );
}
