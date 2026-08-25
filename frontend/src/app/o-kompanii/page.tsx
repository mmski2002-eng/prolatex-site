import type { Metadata } from "next";
import { getContentData } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "О компании Про-Латекс: производство натурального латекса" },
  description:
    "Про-Латекс — специалист по натуральному латексу, компания основана в 2009 году. Матрасы, подушки и топперы из 100% бельгийского латекса Novaya.",
  alternates: { canonical: "/o-kompanii/" },
  openGraph: ogMeta({ url: "/o-kompanii/" }),
};

export default async function OKompaniiPage() {
  const content = await getContentData();

  return (
    <>
      <Breadcrumbs items={[{ name: "О компании", path: "/o-kompanii/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">О компании Про-Латекс</h1>
          <p className="lead">{content.brand.tagline}</p>
        </div>
      </section>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="article-body">
            <p>
              Компания «Про-Латекс» основана в 2009 году и специализируется на
              одном материале — натуральном латексе — и раскрывает его глубже
              конкурентов: 11 моделей матрасов на независимых пружинах и
              монолитных латексных блоках, именная линейка латексных подушек и листовой
              латекс для топперов.
            </p>
            <p>
              Склад компании находится в Санкт-Петербурге по адресу:
              ул.&nbsp;Электропультовцев, д.&nbsp;7, литера&nbsp;Н (индекс 195030).
              В матрасах используется независимый пружинный блок — 580 пружин на
              спальное место, 7 анатомических зон — и бельгийский латекс
              Novaya.
            </p>
          </div>
          <ul className="list-check mt-24" style={{ maxWidth: 640 }}>
            {content.brand.usp.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
