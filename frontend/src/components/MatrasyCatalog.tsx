"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MattressCategory, MattressModel } from "@/lib/types";
import ModelCard from "./ModelCard";

const FIRMNESS_FILTERS = [
  { value: "all", label: "Любая жёсткость" },
  { value: "2", label: "Мягкая" },
  { value: "3", label: "Средняя" },
];

/**
 * Каталог матрасов. Категории — не клиентский фильтр, а ссылки на целевые
 * SEO-страницы (/matrasy/, /matrasy/<категория>/); активная берётся из URL
 * через проп activeCategory. Жёсткость фильтруется на клиенте внутри страницы.
 */
export default function MatrasyCatalog({
  categories,
  models,
  activeCategory = "all",
}: {
  categories: MattressCategory[];
  models: MattressModel[];
  activeCategory?: string;
}) {
  const [firmness, setFirmness] = useState<string>("all");

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (firmness !== "all" && String(m.firmness_scale) !== firmness) return false;
      return true;
    });
  }, [models, firmness]);

  return (
    <div>
      <nav className="filter-bar" aria-label="Категории матрасов">
        <Link
          href="/matrasy/"
          className={`filter-chip${activeCategory === "all" ? " active" : ""}`}
          aria-current={activeCategory === "all" ? "page" : undefined}
        >
          Все категории
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/matrasy/${cat.slug}/`}
            className={`filter-chip${activeCategory === cat.slug ? " active" : ""}`}
            aria-current={activeCategory === cat.slug ? "page" : undefined}
          >
            {cat.name}
          </Link>
        ))}
      </nav>
      <div className="filter-bar" role="group" aria-label="Фильтр по жёсткости">
        {FIRMNESS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`filter-chip${firmness === f.value ? " active" : ""}`}
            aria-pressed={firmness === f.value}
            onClick={() => setFirmness(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        Найдено моделей: {filtered.length}
      </p>
      <div className="model-grid">
        {filtered.map((m) => (
          <ModelCard model={m} key={m.slug} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ color: "var(--gray)" }}>
          По выбранной жёсткости моделей в этой категории нет — посмотрите{" "}
          <Link href="/matrasy/" style={{ textDecoration: "underline" }}>
            все матрасы
          </Link>
          .
        </p>
      )}
    </div>
  );
}
