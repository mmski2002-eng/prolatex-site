import type { Metadata } from "next";
import Link from "next/link";
import { getAllMattresses, getPillowsData } from "@/lib/api";
import {ogMeta, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import B2BAudiences from "@/components/B2BAudiences";
import B2BMaterials from "@/components/B2BMaterials";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: { absolute: "Оптовым клиентам и дилерам — сотрудничество | Про-Латекс" },
  description:
    "Сотрудничество с Про-Латекс: оптовые поставки латексных матрасов и подушек для интернет-магазинов, мебельных магазинов, гостиниц и дизайнеров. Материалы и товарный фид.",
  alternates: { canonical: "/optovym-klientam/" },
  openGraph: ogMeta({ url: "/optovym-klientam/" }),
};

export default async function B2BPage() {
  const [mattresses, pillows] = await Promise.all([
    getAllMattresses(),
    getPillowsData(),
  ]);
  const retail = pillows.retail_line?.models ?? [];

  return (
    <>
      <Breadcrumbs items={[{ name: "Оптовым клиентам", path: "/optovym-klientam/" }]} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Оптовым клиентам", path: "/optovym-klientam/" },
        ])}
      />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap b2b-hero">
          <div>
            <h1 className="page-h1">Оптовым клиентам и партнёрам</h1>
            <p className="lead">
              Про-Латекс поставляет матрасы, подушки и топперы из 100%
              бельгийского латекса для розничных сетей, отелей и
              дизайн-проектов. Работаем с 2009 года, отгрузка со склада в
              Санкт-Петербурге.
            </p>
            <div className="b2b-facts">
              <div className="b2b-fact"><b>с 2009</b><span>года на рынке латекса</span></div>
              <div className="b2b-fact"><b>9 + 5</b><span>моделей матрасов и подушек</span></div>
              <div className="b2b-fact"><b>15–20 лет</b><span>срок службы изделий</span></div>
              <div className="b2b-fact"><b>СПб</b><span>собственный склад, отгрузка по РФ</span></div>
            </div>
          </div>
          <div className="b2b-quick">
            <LeadForm
              source="b2b-quick"
              compact
              title="Некогда читать?"
              subtitle="Оставьте телефон — перезвоним в течение рабочего дня, вышлем оптовый прайс и условия."
            />
          </div>
        </div>
      </section>

      <section aria-label="Форматы сотрудничества">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">С кем работаем</div>
            <h2>Выберите ваш формат сотрудничества</h2>
            <p>
              Условия зависят от формата: выберите направление — покажем, что
              предлагаем именно вам, и отправим заявку с нужной пометкой.
            </p>
          </div>
          <B2BAudiences />
        </div>
      </section>

      <section className="tint" aria-label="Модельный ряд">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Модельный ряд</div>
            <h2>Что вы сможете продавать</h2>
            <p>
              9 моделей матрасов в двух конструкциях и 5 готовых подушек.
              Полные характеристики — в карточках, фото всего ряда — в архиве
              для партнёров ниже.
            </p>
          </div>
          <h3 style={{ marginBottom: 20 }}>Матрасы — {mattresses.length} моделей</h3>
          <div className="grid-4">
            {mattresses.map((m) => (
              <Link href={`/matrasy/${m.slug}/`} className="cell" key={m.slug} style={{ display: "block" }}>
                {m.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.image}
                    alt={`Матрас ${m.name}`}
                    width={900}
                    height={800}
                    loading="lazy"
                    style={{ width: "100%", height: 120, objectFit: "contain", marginBottom: 10 }}
                  />
                )}
                <b style={{ fontSize: 15 }}>{m.name}</b>
                <p style={{ fontSize: 13, color: "var(--gray)" }}>
                  {m.height_cm} см · {m.firmness}
                </p>
              </Link>
            ))}
          </div>
          <h3 style={{ margin: "40px 0 20px" }}>Подушки — {retail.length} моделей</h3>
          <div className="grid-4">
            {retail.map((p) => (
              <Link href="/podushki/" className="cell" key={p.name} style={{ display: "block" }}>
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={`Латексная подушка ${p.name}`}
                    width={900}
                    height={800}
                    loading="lazy"
                    style={{ width: "100%", height: 120, objectFit: "contain", marginBottom: 10 }}
                  />
                )}
                <b style={{ fontSize: 15 }}>{p.name}</b>
                <p style={{ fontSize: 13, color: "var(--gray)" }}>
                  {p.length_mm / 10}×{p.width_mm / 10}×{p.height_mm / 10} см · форма {p.base_model}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Нестандартные заказы">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Гибкое производство</div>
            <h2>Нестандартные размеры под ваш проект</h2>
          </div>
          <div className="grid-3">
            <div className="cell">
              <h3>Матрасы от 80×190 до 200×200</h3>
              <p className="mt-8">Семь вариантов ширины и три длины в каждой модели — под любой номерной фонд и мебельную линейку.</p>
            </div>
            <div className="cell">
              <h3>Раскрой топперов в любой размер</h3>
              <p className="mt-8">Листовой латекс толщиной 30–60 мм режем под нестандартные кровати, яхты и детскую мебель. Рулоны до 8 метров.</p>
            </div>
            <div className="cell">
              <h3>Жёсткость под задачу</h3>
              <p className="mt-8">Четыре плотности латекса от 55 до 70 кг/м³ — соберём партию под требования вашего сегмента.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Материалы для партнёров">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Материалы</div>
            <h2>Материалы для партнёров</h2>
            <p>
              Фото, сертификат, товарный фид и презентация компании доступны
              партнёрам после отправки заявки на этой странице — ссылки
              откроются автоматически.
            </p>
          </div>
          <B2BMaterials />
        </div>
      </section>

      <section className="cta-section" aria-label="Приглашение к сотрудничеству">
        <div className="wrap cta-grid">
          <div>
            <h2>Станьте партнёром Про-Латекс</h2>
            <p>
              Оставьте заявку — вышлем оптовый прайс, условия по вашему формату
              и материалы для старта продаж. Отвечаем в течение рабочего дня.
            </p>
          </div>
          <LeadForm
            source="b2b-final"
            title="Получить оптовый прайс"
            subtitle="Укажите компанию и формат работы в комментарии."
          />
        </div>
      </section>
    </>
  );
}
