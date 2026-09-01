import Link from "next/link";
import Image from "next/image";
import type { MattressModel } from "@/lib/types";
import { firmnessLabel, priceFrom } from "@/lib/format";

const CATEGORY_LABEL: Record<string, string> = {
  pruzhinnye: "Пружинный",
  bespruzhinnye: "Беспружинный",
};

export default function ModelCard({
  model,
  oneClickHref,
}: {
  model: MattressModel;
  /** Якорь формы заявки: включает вторую кнопку «Купить в один клик». */
  oneClickHref?: string;
}) {
  return (
    <div className="model-card">
      <div className="model-card-media">
        {model.image ? (
          <Image
            src={model.image}
            alt={`Матрас ${model.name} — латексный блок`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        ) : (
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <rect x="8" y="26" width="56" height="26" rx="4" stroke="#B99B72" strokeWidth="1.6" />
            <path d="M8 40h56" stroke="#D8C4A6" strokeWidth="1.2" />
          </svg>
        )}
      </div>
      <div className="model-card-body">
        <h3>{model.name}</h3>
        <div className="meta">
          {CATEGORY_LABEL[model.category] ?? model.category} · высота {model.height_cm} см
        </div>
        <p className="summary">{model.summary}</p>
        <div className="tag-row">
          <span className="tag sand">{firmnessLabel(model.firmness_scale)}</span>
          {model.dual_sided && <span className="tag">Две стороны</span>}
          {model.topper_cm && <span className="tag">Тонкий матрас {model.topper_cm * 10} мм</span>}
        </div>
        {model.price_from && <div className="model-price">{priceFrom(model.price_from)}</div>}
        <div className="model-card-actions">
          <Link href={`/matrasy/${model.slug}/`} className="btn btn-outline model-card-link">
            Подробнее о модели
          </Link>
          {oneClickHref && (
            <a href={oneClickHref} className="btn btn-eco model-card-buy">
              Купить в один клик
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
