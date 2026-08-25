import type { Metadata } from "next";
import { getContentData } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoBlock from "@/components/VideoBlock";

export const metadata: Metadata = {
  title: { absolute: "Технология Dunlop — вулканизация латекса | Про-Латекс" },
  description:
    "Технология вулканизации латекса Dunlop: паровая печь до 100 °C, плотности от 55 до 70 кг/м³, толщина блоков 10–16 см. Основа всех матрасов и подушек Про-Латекс.",
  alternates: { canonical: "/tehnologii/" },
  openGraph: ogMeta({ url: "/tehnologii/" }),
};

export default async function TehnologiiPage() {
  const content = await getContentData();
  const dunlop = content.technologies.find((t) => t.slug === "dunlop");

  return (
    <>
      <Breadcrumbs items={[{ name: "Технология", path: "/tehnologii/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Технология Dunlop</h1>
          <p className="lead">
            Все матрасы и подушки Про-Латекс изготавливаются из латекса,
            вулканизированного по классической технологии Dunlop — проверенной
            временем и отработанной до эталонного качества.
          </p>
        </div>
      </section>

      {dunlop && (
        <section aria-label={dunlop.name}>
          <div className="wrap two-col">
            <div>
              <span className="tag sand">{dunlop.badge}</span>
              <h2 className="mt-16">{dunlop.name}</h2>
              <p className="mt-16" style={{ color: "var(--gray)", fontSize: 16 }}>
                {dunlop.description}
              </p>
            </div>
            <div className="spec-table">
              {dunlop.specs.thickness_cm && (
                <div className="spec-row">
                  <span>Толщина</span>
                  <b>{dunlop.specs.thickness_cm.join(" / ")} см</b>
                </div>
              )}
              {Object.entries(dunlop.specs.densities_kg_m3).map(([density, label]) => (
                <div className="spec-row" key={density}>
                  <span>{density} кг/м³</span>
                  <b style={{ textTransform: "capitalize" }}>{label}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="tint" aria-label="Почему Dunlop">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Почему Dunlop</div>
            <h2>Четыре причины доверять технологии</h2>
          </div>
          <div className="grid-4">
            <div className="cell">
              <h3>Паровая вулканизация</h3>
              <p>Латекс запекается в паровой печи при стабильной температуре до 100 °C — структура получается плотной и однородной.</p>
            </div>
            <div className="cell">
              <h3>Четыре плотности</h3>
              <p>От 55 кг/м³ (мягкий) до 70 кг/м³ (экстра-жёсткий) — под любой вес и предпочтения по жёсткости.</p>
            </div>
            <div className="cell">
              <h3>Стабильность годами</h3>
              <p>Блоки Dunlop держат характеристики 15–20 лет — деформация за десятилетие составляет единицы процентов.</p>
            </div>
            <div className="cell">
              <h3>Строгий отбор сырья</h3>
              <p>Многолетние исследования и разработки, а также строгий отбор сырья гарантируют премиальное качество каждого блока.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Сертификат">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Качество подтверждено</div>
            <h2>Сертификат соответствия</h2>
            <p>
              Латекс, из которого изготавливается продукция, сертифицирован в
              системе добровольной сертификации «Промтехстандарт». Сертификат
              действителен до 26.11.2027.
            </p>
          </div>
          <div
            className="cell"
            style={{
              border: "1px solid var(--line)",
              display: "grid",
              gridTemplateColumns: "minmax(140px, 200px) 1fr",
              gap: 24,
              alignItems: "center",
              maxWidth: 720,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/cert/sertifikat-preview.webp"
              alt="Сертификат соответствия на латекс (система «Промтехстандарт»), действует до 26.11.2027"
              width={600}
              height={840}
              loading="lazy"
              style={{ width: "100%", height: "auto", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}
            />
            <div>
              <h3>Сертификат соответствия РОСС RU.32001.04ИБФ1.ОСП28.65485</h3>
              <p className="mt-8" style={{ color: "var(--gray)" }}>
                Продукция: латекс из смеси натурального и искусственного.
                Изготовитель: Novaya (заводы в Бельгии и Чехии). Срок действия:
                27.11.2024 – 26.11.2027.
              </p>
              <a
                href="/optovym-klientam/"
                className="btn btn-outline"
                style={{ marginTop: 16 }}
              >
                PDF — по запросу для партнёров
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="tint" aria-label="Видео производства">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Видео</div>
            <h2>Производство блоков Dunlop</h2>
          </div>
          <VideoBlock filename="Novaya-DunlopBlocks-Video-V4.mp4" title="Производство латексных блоков Dunlop" />
        </div>
      </section>
    </>
  );
}
