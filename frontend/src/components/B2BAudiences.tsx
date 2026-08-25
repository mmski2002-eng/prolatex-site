"use client";

import { useState } from "react";
import LeadForm from "@/components/LeadForm";

interface Audience {
  key: string;
  title: string;
  short: string;
  offer: string[];
  formHint: string;
  commentPlaceholder: string;
}

const AUDIENCES: Audience[] = [
  {
    key: "shop",
    title: "Интернет-магазины",
    short: "Каталог на вашу витрину за один день",
    offer: [
      "Готовый товарный фид (YML) — товары, изображения, характеристики; цены после согласования условий",
      "Архив фото всего модельного ряда в веб-качестве",
      "Дропшиппинг или отгрузка партиями со склада в Санкт-Петербурге",
      "Контент-поддержка: описания, характеристики и сертификат для карточек",
    ],
    formHint: "Укажите адрес вашего магазина/сайта и примерный ассортимент, который хотите подключить.",
    commentPlaceholder: "Например: магазин на Ozon и свой сайт, хотим подключить матрасы и подушки",
  },
  {
    key: "furniture",
    title: "Мебельные магазины",
    short: "Матрасы и подушки к вашим кроватям",
    offer: [
      "Оптовый прайс на модельный ряд из 11 матрасов и 5 подушек",
      "Образцы латекса и обучение продавцов продукту",
      "Матрица «кровать → рекомендуемый матрас» под вашу экспозицию",
      "Резерв ходовых размеров на складе под ваши продажи",
    ],
    formHint: "Укажите город, количество салонов и какие размеры кроватей у вас основные.",
    commentPlaceholder: "Например: 3 салона в Казани, кровати 160×200 и 180×200",
  },
  {
    key: "horeca",
    title: "Гостиницы и апартаменты",
    short: "Экономика номера в долгую",
    offer: [
      "Матрасы с гарантией 15–20 лет и нагрузкой до 150 кг на спальное место",
      "Спеццена на объёмные партии от 10 номеров",
      "Единые размеры под номерной фонд, поэтапная поставка",
      "Сертификат соответствия для тендерной документации",
    ],
    formHint: "Укажите объект, число номеров и желаемые размеры спальных мест.",
    commentPlaceholder: "Например: отель на 24 номера в Сочи, матрасы 90×200, нужен расчёт",
  },
  {
    key: "design",
    title: "Дизайнеры и архитекторы",
    short: "Комиссионные условия для профессионалов",
    offer: [
      "Партнёрское вознаграждение с каждого заказа по вашему проекту",
      "Нестандартные размеры: матрасы от 80×190 до 200×200 см, раскрой топперов под любой размер",
      "Персональный менеджер для сопровождения проектов",
      "Материалы и образцы для презентации заказчику",
    ],
    formHint: "Расскажите о текущем проекте: объект, сроки, что требуется.",
    commentPlaceholder: "Например: проект квартиры, нужен матрас 200×200 под заказ к ноябрю",
  },
  {
    key: "opt",
    title: "Оптовые покупатели",
    short: "Прямые цены от производителя",
    offer: [
      "Оптовый прайс от производителя латексных изделий, скидки от объёма",
      "Документооборот для юрлиц, работа по договору поставки",
      "Резерв товара на складе в Санкт-Петербурге",
      "Персональный менеджер и приоритетная отгрузка",
    ],
    formHint: "Укажите компанию, город и ориентировочные объёмы закупки.",
    commentPlaceholder: "Например: закупка от 50 матрасов в квартал, интересуют условия и прайс",
  },
];

export default function B2BAudiences() {
  const [active, setActive] = useState(AUDIENCES[0]);

  return (
    <>
      <div className="filter-bar" role="tablist" aria-label="Форматы сотрудничества" style={{ gap: 10, marginBottom: 32 }}>
        {AUDIENCES.map((a) => (
          <button
            key={a.key}
            role="tab"
            aria-selected={active.key === a.key}
            className={`filter-chip${active.key === a.key ? " active" : ""}`}
            onClick={() => setActive(a)}
            type="button"
          >
            {a.title}
          </button>
        ))}
      </div>

      <div className="two-col" style={{ alignItems: "start", gap: 40 }}>
        <div className="cell" style={{ border: "1px solid var(--line)" }}>
          <span className="tag sand">{active.title}</span>
          <h3 className="mt-16" style={{ fontSize: 22 }}>{active.short}</h3>
          <ul className="list-check mt-16">
            {active.offer.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
        <div id="b2b-lead">
          <LeadForm
            key={active.key}
            source={`b2b-${active.key}`}
            model={active.title}
            contextLabel="Формат"
            title={`Заявка: ${active.title.toLowerCase()}`}
            subtitle={active.formHint}
            commentPlaceholder={active.commentPlaceholder}
          />
        </div>
      </div>
    </>
  );
}
