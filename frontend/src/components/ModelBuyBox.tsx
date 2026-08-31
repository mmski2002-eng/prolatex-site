"use client";

import { useState } from "react";
import LeadForm from "./LeadForm";
import { priceFrom } from "@/lib/format";

export default function ModelBuyBox({
  modelName,
  modelSlug,
  widths,
  lengths,
  priceFrom: price,
}: {
  modelName: string;
  modelSlug: string;
  widths: number[];
  lengths: number[];
  priceFrom?: number;
}) {
  const [width, setWidth] = useState(widths[Math.floor(widths.length / 2)]);
  const [length, setLength] = useState(lengths[lengths.length - 1]);
  const size = `${width}×${length} см`;

  return (
    <div>
      {price && (
        <div className="buybox-price">
          <span className="buybox-price-value">{priceFrom(price)}</span>
          <span className="buybox-price-note">Итоговая цена зависит от размера</span>
        </div>
      )}
      <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>
        Ширина матраса
      </p>
      <div className="size-picker" role="group" aria-label="Выбор ширины матраса">
        {widths.map((w) => (
          <button
            key={w}
            type="button"
            className={`size-btn${w === width ? " selected" : ""}`}
            aria-pressed={w === width}
            onClick={() => setWidth(w)}
          >
            {w} см
          </button>
        ))}
      </div>
      <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>
        Длина матраса
      </p>
      <div className="size-picker" role="group" aria-label="Выбор длины матраса">
        {lengths.map((l) => (
          <button
            key={l}
            type="button"
            className={`size-btn${l === length ? " selected" : ""}`}
            aria-pressed={l === length}
            onClick={() => setLength(l)}
          >
            {l} см
          </button>
        ))}
      </div>
      <LeadForm
        source={`model-${modelSlug}`}
        model={modelName}
        size={size}
        title="Узнать цену"
        subtitle="Итоговая цена зависит от размера и комплектации. Оставьте заявку — менеджер посчитает точную стоимость за 15 минут."
      />
    </div>
  );
}
