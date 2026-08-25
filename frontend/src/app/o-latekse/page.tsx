import type { Metadata } from "next";
import { getContentData } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "О латексе: история, свойства и 10 причин выбрать его" },
  description:
    "Что такое натуральный латекс: сок дерева гевеи, история вулканизации, путь от плантации до бельгийского матраса. 10 причин выбрать латексный матрас.",
  alternates: { canonical: "/o-latekse/" },
  openGraph: ogMeta({ url: "/o-latekse/" }),
};

export default async function OLatekseePage() {
  const content = await getContentData();

  return (
    <>
      <Breadcrumbs items={[{ name: "О латексе", path: "/o-latekse/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">{content.latex_history.title}</h1>
        </div>
      </section>

      <section aria-label="История латекса">
        <div className="wrap">
          <div className="article-body">
            {content.latex_history.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Презентация компании">
        <div className="wrap">
          <div className="booklet-card">
            <div className="booklet-cover" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="46" height="46" fill="none">
                <rect x="9" y="6" width="26" height="34" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M15 15h14M15 21h14M15 27h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M31 33.5V42l4-3 4 3v-8.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="var(--sand-tint)" />
              </svg>
            </div>
            <div className="booklet-body">
              <div className="section-tag">Презентация</div>
              <h2>Буклет ProLatex — мягкий домашний стиль</h2>
              <p>
                Коротко о компании, преимуществах натурального латекса и уходе
                за матрасом — в одном PDF. Удобно сохранить или переслать.
              </p>
              <a
                href="/docs/prolatex-prezentaciya.pdf"
                download
                className="btn booklet-btn"
              >
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Скачать презентацию · PDF
              </a>
              <span className="booklet-meta">PDF · 5 страниц · 0,45 МБ</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tint" aria-label="10 причин">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">10 причин</div>
            <h2>Почему стоит выбрать натуральный латекс</h2>
          </div>
          <div className="grid-2">
            {content.reasons10.map((r) => (
              <div className="cell reason-cell" key={r.n}>
                <span className="reason-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <path d="M12 3C7 7.5 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-2-6.5-7-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M12 21v-8m0 0 3-3m-3 3-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-16">{r.title}</h3>
                <p className="mt-8">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
