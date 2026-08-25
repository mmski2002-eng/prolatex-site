import type { Metadata } from "next";
import { getContentData } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "Доставка и оплата матрасов Про-Латекс по всей России" },
  description:
    "Доставка латексных матрасов по Москве и России, варианты оплаты для физических и юридических лиц, гарантия 10 лет на пружинный блок и латекс.",
  alternates: { canonical: "/dostavka-i-oplata/" },
  openGraph: ogMeta({ url: "/dostavka-i-oplata/" }),
};

export default async function DostavkaPage() {
  const content = await getContentData();
  const d = content.delivery;

  return (
    <>
      <Breadcrumbs items={[{ name: "Доставка и оплата", path: "/dostavka-i-oplata/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Доставка и оплата</h1>
        </div>
      </section>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="grid-2">
            <div className="cell">
              <h3>Доставка по Москве</h3>
              <p className="mt-8">{d.moscow}</p>
            </div>
            <div className="cell">
              <h3>Доставка по России</h3>
              <p className="mt-8">{d.russia}</p>
            </div>
            <div className="cell">
              <h3>Оплата</h3>
              <p className="mt-8">{d.payment}</p>
            </div>
            <div className="cell">
              <h3>Гарантия</h3>
              <p className="mt-8">{d.warranty}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
