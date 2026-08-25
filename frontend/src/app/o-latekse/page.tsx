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
