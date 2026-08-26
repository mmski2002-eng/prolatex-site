import type { Metadata } from "next";
import Link from "next/link";
import { getAllMattresses, getMattressesData } from "@/lib/api";
import {itemListJsonLd, ogMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import MatrasyCatalog from "@/components/MatrasyCatalog";

export const metadata: Metadata = {
  title: { absolute: "Латексные матрасы — купить матрас из латекса, цены" },
  description:
    "Каталог латексных матрасов Про-Латекс: пружинные и беспружинные. 100% натуральный бельгийский латекс, гарантия 15–20 лет, размеры 80–200 см.",
  alternates: { canonical: "/matrasy/" },
  openGraph: ogMeta({ url: "/matrasy/" }),
};

export default async function MatrasyPage() {
  const [models, data] = await Promise.all([
    getAllMattresses(),
    getMattressesData(),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: "Матрасы", path: "/matrasy/" }]} />
      <JsonLd
        data={itemListJsonLd(
          models.map((m) => ({ name: m.name, url: `/matrasy/${m.slug}/` })),
          "Каталог латексных матрасов"
        )}
      />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Латексные матрасы — каталог из 9 моделей</h1>
          <p className="lead">
            Все матрасы Про-Латекс сделаны из 100% натурального бельгийского
            латекса Novaya. Две конструкции — пружинные на независимом
            пружинном блоке с 7 зонами и беспружинные из цельного латекса.
            Жёсткость от мягкой до средней, высота от 10 до 26 см, размеры
            от 80×190 до 200×200 см.
          </p>
        </div>
      </section>
      <section style={{ paddingTop: 48 }}>
        <div className="wrap">
          <MatrasyCatalog categories={data.categories} models={models} />
        </div>
      </section>
      <section className="tint">
        <div className="wrap">
          <div className="section-head">
            <h2>Как выбрать латексный матрас</h2>
            <p>
              Матрас из натурального латекса подбирают по трём параметрам:
              конструкции (пружинная или монолитная), жёсткости (по весу и
              позе сна) и высоте. Если сомневаетесь — пройдите{" "}
              <Link href="/podbor/" style={{ color: "var(--sand-deep)", fontWeight: 700 }}>
                квиз-подбор
              </Link>{" "}
              или изучите категории: {" "}
              <Link href="/matrasy/pruzhinnye/">пружинные</Link> и{" "}
              <Link href="/matrasy/bespruzhinnye/">беспружинные</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
