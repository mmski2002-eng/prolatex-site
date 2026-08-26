import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllMattresses,
  getContentData,
  getMattressesData,
  getMattressBySlug,
  getMattressesByCategory,
  getRelatedMattresses,
} from "@/lib/api";
import {faqJsonLd, itemListJsonLd, productJsonLd, ogMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ModelCard from "@/components/ModelCard";
import MatrasyCatalog from "@/components/MatrasyCatalog";
import LayerDiagram, { LayerList } from "@/components/LayerDiagram";
import SpringZonesDiagram from "@/components/SpringZonesDiagram";
import SizeTable from "@/components/SizeTable";
import ModelBuyBox from "@/components/ModelBuyBox";
import FaqAccordion from "@/components/FaqAccordion";
import MediaGallery from "@/components/MediaGallery";
import { firmnessLabel } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const [data, models] = await Promise.all([
    getMattressesData(),
    getAllMattresses(),
  ]);
  return [
    ...data.categories.map((c) => ({ slug: c.slug })),
    ...models.map((m) => ({ slug: m.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMattressesData();
  const category = data.categories.find((c) => c.slug === slug);
  if (category) {
    return {
      title: category.meta_title ? { absolute: category.meta_title } : category.title,
      description: category.meta_description ?? `${category.description} Размеры от 80×190 до 200×200 см, гарантия 15–20 лет.`,
      alternates: { canonical: `/matrasy/${slug}/` },
      openGraph: ogMeta({ url: `/matrasy/${slug}/` }),
    };
  }
  const model = await getMattressBySlug(slug);
  if (model) {
    const title = `Матрас ${model.name} — натуральный латекс`;
    return {
      title,
      description: model.meta_description ?? `${model.summary} Высота ${model.height_cm} см, жёсткость ${model.firmness}. Размеры 80–200 см, гарантия 15–20 лет.`,
      alternates: { canonical: `/matrasy/${slug}/` },
      openGraph: ogMeta({ url: `/matrasy/${slug}/`, title }),
    };
  }
  return {};
}

export default async function MatrasySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMattressesData();
  const category = data.categories.find((c) => c.slug === slug);

  if (category) {
    return <CategoryPage categorySlug={category.slug} />;
  }

  const model = await getMattressBySlug(slug);
  if (!model) notFound();

  return <ModelPage slug={slug} />;
}

async function CategoryPage({ categorySlug }: { categorySlug: string }) {
  const [data, models] = await Promise.all([
    getMattressesData(),
    getMattressesByCategory(categorySlug),
  ]);
  const category = data.categories.find((c) => c.slug === categorySlug)!;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Матрасы", path: "/matrasy/" },
          { name: category.name, path: `/matrasy/${category.slug}/` },
        ]}
      />
      <JsonLd
        data={itemListJsonLd(
          models.map((m) => ({ name: m.name, url: `/matrasy/${m.slug}/` })),
          category.title
        )}
      />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">{category.title}</h1>
          <p className="lead">{category.description}</p>
        </div>
      </section>
      <section style={{ paddingTop: 48 }}>
        <div className="wrap">
          <MatrasyCatalog
            categories={data.categories}
            models={models}
            activeCategory={categorySlug}
          />
        </div>
      </section>
    </>
  );
}

async function ModelPage({ slug }: { slug: string }) {
  const [model, data, content, related] = await Promise.all([
    getMattressBySlug(slug),
    getMattressesData(),
    getContentData(),
    getRelatedMattresses(slug, 3),
  ]);
  if (!model) notFound();
  const category = data.categories.find((c) => c.slug === model.category);
  const hasSprings = Boolean(model.spring_height_cm);
  const modelFaq = content.faq.slice(0, 4);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Матрасы", path: "/matrasy/" },
          ...(category ? [{ name: category.name, path: `/matrasy/${category.slug}/` }] : []),
          { name: model.name, path: `/matrasy/${model.slug}/` },
        ]}
      />
      <JsonLd
        data={productJsonLd({
          name: `Матрас ${model.name}`,
          description: model.summary,
          url: `/matrasy/${model.slug}/`,
          image: model.image,
          sku: `prolatex-${model.slug}`,
          category: category?.name ?? "Матрасы",
          specs: [
            { name: "Высота матраса", value: `${model.height_cm} см` },
            { name: "Жёсткость", value: model.firmness },
            { name: "Латекс суммарно", value: `${model.latex_total_cm} см` },
            { name: "Наполнитель", value: data.common.latex_origin },
            ...(model.spring_height_cm
              ? [{ name: "Пружинный блок", value: data.common.spring_block }]
              : []),
            {
              name: "Максимальная нагрузка на спальное место",
              value: `${data.common.max_weight_per_place_kg} кг`,
            },
            {
              name: "Размеры (ширина × длина)",
              value: `${data.common.widths_cm[0]}–${data.common.widths_cm[data.common.widths_cm.length - 1]} × ${data.common.lengths_cm.join("/")} см`,
            },
          ],
        })}
      />
      <JsonLd data={faqJsonLd(modelFaq)} />

      <section style={{ paddingTop: 8, paddingBottom: 56 }}>
        <div className="wrap two-col">
          <div>
            <h1 className="page-h1">Матрас {model.name} — натуральный латекс</h1>
            <p className="lead" style={{ marginBottom: 24 }}>{model.summary}</p>
            <div className="tag-row">
              <span className="tag sand">{firmnessLabel(model.firmness_scale)} жёсткость</span>
              <span className="tag">Высота {model.height_cm} см</span>
              {model.dual_sided && <span className="tag">Две стороны жёсткости</span>}
              {category && <span className="tag">{category.name}</span>}
            </div>
            <p style={{ fontSize: 15, color: "var(--gray)", marginBottom: 32 }}>{model.audience}</p>

            {model.image && (
              <figure style={{ margin: "0 0 32px", maxWidth: 560 }}>
                <MediaGallery
                  aspect="4/3"
                  items={[
                    ...(model.images ?? [
                      {
                        src: model.image,
                        alt: `Матрас ${model.name}`,
                        label: "Фото",
                      },
                    ]).map((img) => ({
                      type: "image" as const,
                      src: img.src,
                      alt: img.alt,
                      label: img.label,
                    })),
                    ...(model.video
                      ? [
                          {
                            type: "video" as const,
                            src: model.video.src,
                            poster: model.video.poster,
                            alt: model.video.alt,
                            label: model.video.label,
                          },
                        ]
                      : []),
                  ]}
                />
              </figure>
            )}

            <div className="spec-table mt-24">
              <div className="spec-row"><span>Тип конструкции</span><b>{category?.name ?? model.category}</b></div>
              <div className="spec-row"><span>Наполнитель</span><b>{data.common.latex_origin}</b></div>
              <div className="spec-row"><span>Жёсткость</span><b>{model.firmness}</b></div>
              <div className="spec-row"><span>Высота матраса</span><b>{model.height_cm} см</b></div>
              <div className="spec-row"><span>Латекс суммарно</span><b>{model.latex_total_cm} см</b></div>
              {model.spring_height_cm && (
                <div className="spec-row"><span>Пружинный блок</span><b>{data.common.spring_block}</b></div>
              )}
              {model.topper_cm && (
                <div className="spec-row"><span>Тонкий матрас</span><b>{model.topper_cm} см</b></div>
              )}
              <div className="spec-row"><span>Чехол</span><b>{data.common.cover}</b></div>
              <div className="spec-row"><span>Макс. нагрузка</span><b>{data.common.max_weight_per_place_kg} кг на спальное место</b></div>
              <div className="spec-row"><span>Цена</span><b>По запросу</b></div>
            </div>
          </div>
          <ModelBuyBox
            modelName={model.name}
            modelSlug={model.slug}
            widths={data.common.widths_cm}
            lengths={data.common.lengths_cm}
          />
        </div>
      </section>

      <section className="tint" aria-label="Анатомия матраса">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Анатомия</div>
            <h2>Схема слоёв матраса {model.name}</h2>
          </div>
          <div className="layers-grid">
            <LayerDiagram layers={model.layers} totalHeightCm={model.height_cm} />
            <LayerList layers={model.layers} />
          </div>
        </div>
      </section>

      {model.highlights && model.highlights.length > 0 && (
        <section aria-label={`Преимущества матраса ${model.name}`}>
          <div className="wrap">
            <div className="section-head">
              <div className="section-tag">Почему эта модель</div>
              <h2>Матрас {model.name} — что вы получаете</h2>
            </div>
            <div className="grid-3">
              {model.highlights.map((h) => (
                <div className="cell" key={h.title}>
                  <h3>{h.title}</h3>
                  <p className="mt-8" style={{ color: "var(--gray)", fontSize: 14 }}>
                    {h.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasSprings && (
        <section aria-label="Пружинный блок">
          <div className="wrap">
            <div className="section-head">
              <div className="section-tag">Пружинный блок</div>
              <h2>независимый пружинный блок (7 зон) — семь анатомических зон</h2>
              <p>{data.common.spring_block}</p>
            </div>
            <SpringZonesDiagram />
          </div>
        </section>
      )}

      <section
        className={hasSprings || model.highlights?.length ? "tint" : undefined}
        aria-label="Размеры"
      >
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Размеры</div>
            <h2>Доступные размеры матраса {model.name}</h2>
            <p>Все сочетания ширины и длины из стандартной сетки Про-Латекс. Возможен раскрой в нестандартный размер по запросу.</p>
          </div>
          <SizeTable widths={data.common.widths_cm} lengths={data.common.lengths_cm} />
        </div>
      </section>

      {related.length > 0 && (
        <section aria-label="Похожие модели">
          <div className="wrap">
            <div className="section-head">
              <div className="section-tag">Похожие модели</div>
              <h2>Другие латексные матрасы</h2>
            </div>
            <div className="model-grid">
              {related.map((m) => (
                <ModelCard model={m} key={m.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="tint" aria-label="Частые вопросы">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Вопросы и ответы</div>
            <h2>Частые вопросы о матрасе {model.name}</h2>
          </div>
          <FaqAccordion items={modelFaq} />
        </div>
      </section>

      <section aria-label="Ссылки">
        <div className="wrap">
          <p style={{ color: "var(--gray)" }}>
            Больше о материале — в статье{" "}
            <Link href="/blog/kak-vybrat-zhestkost/" style={{ color: "var(--sand-deep)", fontWeight: 700 }}>
              «Как выбрать жёсткость матраса по весу и позе сна»
            </Link>
            . Все модели категории «{category?.name}» — в разделе{" "}
            <Link href={`/matrasy/${category?.slug}/`} style={{ color: "var(--sand-deep)", fontWeight: 700 }}>
              {category?.name}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
