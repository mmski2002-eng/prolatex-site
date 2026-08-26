"use client";

import { useEffect, useState } from "react";

interface UnlockMaterial {
  title: string;
  href: string;
}

interface Unlock {
  token: string;
  materials: UnlockMaterial[];
}

const LOCKED_ITEMS = [
  {
    title: "Фотографии товаров",
    text: "Архив фото всего модельного ряда: 9 матрасов, 2 подушки в трёх ракурсах, тонкий матрас. Файлы названы по моделям.",
  },
  {
    title: "Сертификат соответствия",
    text: "Сертификат «Промтехстандарт» на латекс, действует до 26.11.2027.",
  },
  {
    title: "Товарный фид (YML)",
    text: "Автоматически обновляемая персональная ссылка: товары, изображения, характеристики. Совместим с Яндекс.Маркетом и большинством CMS.",
  },
  {
    title: "Презентация компании",
    text: "Буклет ProLatex «Мягкий домашний стиль»: о компании, натуральном латексе и уходе за матрасом. PDF, 5 страниц.",
  },
];

/**
 * Материалы для партнёров. Заперты до отправки любой B2B-заявки на этой
 * странице: /api/lead возвращает подписанный токен, ссылки строятся с ним.
 */
export default function B2BMaterials() {
  const [unlock, setUnlock] = useState<Unlock | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("plx_partner_unlock");
        if (raw) setUnlock(JSON.parse(raw));
      } catch {
        /* повреждённое значение игнорируем */
      }
    };
    read();
    window.addEventListener("plx-partner-unlock", read);
    return () => window.removeEventListener("plx-partner-unlock", read);
  }, []);

  if (unlock) {
    return (
      <div className="grid-2">
        {LOCKED_ITEMS.map((item, i) => {
          const m = unlock.materials[i];
          return (
            <div className="cell" key={item.title}>
              <h3>{item.title}</h3>
              <p className="mt-8" style={{ color: "var(--gray)" }}>{item.text}</p>
              {m && (
                <a
                  href={m.href}
                  className="btn btn-eco btn-block"
                  style={{ marginTop: 16 }}
                  target={m.href.includes("/feed/") ? "_blank" : undefined}
                  rel="noopener"
                >
                  {m.href.includes("/feed/") ? "Открыть фид" : "Скачать"}
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid-2">
      {LOCKED_ITEMS.map((item) => (
        <div className="cell b2b-locked" key={item.title}>
          <span className="b2b-lock-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <h3>{item.title}</h3>
          <p className="mt-8" style={{ color: "var(--gray)" }}>{item.text}</p>
          <a href="#b2b-lead" className="b2b-locked-note">
            Откроется после отправки заявки →
          </a>
        </div>
      ))}
    </div>
  );
}
