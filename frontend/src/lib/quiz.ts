import type { MattressModel } from "./types";

export type QuizWeight = "light" | "medium" | "heavy";
export type QuizPose = "back" | "side" | "belly" | "mixed";
export type QuizFirmness = "soft" | "medium" | "firm" | "unsure";
export type QuizType = "pruzhinnye" | "bespruzhinnye" | "any";

export interface QuizAnswers {
  weight: QuizWeight;
  pose: QuizPose;
  firmness: QuizFirmness;
  type: QuizType;
}

export interface QuizRecommendation {
  model: MattressModel;
  reason: string;
}

function weightScale(w: QuizWeight): number {
  if (w === "light") return 2;
  if (w === "heavy") return 3.3;
  return 2.8;
}

function poseScale(p: QuizPose): number {
  if (p === "side") return 2;
  if (p === "back") return 3;
  if (p === "belly") return 3.2;
  return 2.6;
}

function firmnessScale(f: QuizFirmness): number | null {
  if (f === "soft") return 2;
  if (f === "medium") return 3;
  if (f === "firm") return 3.3;
  return null;
}

export function computeTargetFirmness(answers: QuizAnswers): number {
  const parts = [weightScale(answers.weight), poseScale(answers.pose)];
  const fs = firmnessScale(answers.firmness);
  if (fs !== null) parts.push(fs, fs); // мнение пользователя весит больше
  const avg = parts.reduce((a, b) => a + b, 0) / parts.length;
  return avg;
}

function reasonFor(model: MattressModel, answers: QuizAnswers): string {
  const bits: string[] = [];
  if (answers.weight === "heavy") {
    bits.push("выдерживает нагрузку до 150 кг на спальное место");
  } else if (answers.weight === "light") {
    bits.push("мягкая посадка без лишнего давления при небольшом весе");
  }
  if (answers.pose === "side") {
    bits.push("обволакивающий слой латекса снимает точки давления в плечах и бёдрах — важно для сна на боку");
  } else if (answers.pose === "belly" || answers.pose === "back") {
    bits.push("достаточная жёсткость держит поясницу в анатомичном положении");
  } else if (answers.pose === "mixed" && model.dual_sided) {
    bits.push("двусторонняя жёсткость подстроится под смену позы за ночь");
  }
  if (model.category === "bespruzhinnye") {
    bits.push("монолитный латекс без пружин — точечная поддержка каждого сантиметра тела");
  }
  if (model.category === "pruzhinnye") {
    bits.push("независимый пружинный блок с 7 зонами добавляет упругость и вентиляцию");
  }
  bits.push(
    `жёсткость модели (${model.firmness}) близка к вашему запросу`
  );
  return bits.slice(0, 3).join("; ") + ".";
}

export function recommendMattresses(
  models: MattressModel[],
  answers: QuizAnswers,
  limit = 3
): QuizRecommendation[] {
  const target = computeTargetFirmness(answers);
  let pool = models;
  if (answers.type !== "any") {
    const filtered = models.filter((m) => m.category === answers.type);
    if (filtered.length > 0) pool = filtered;
  }

  const scored = pool.map((model) => {
    let score = Math.abs(model.firmness_scale - target);
    if (answers.pose === "mixed" && model.dual_sided) score -= 0.5;
    if (answers.firmness === "unsure" && model.dual_sided) score -= 0.3;
    return { model, score };
  });

  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map(({ model }) => ({
    model,
    reason: reasonFor(model, answers),
  }));
}
