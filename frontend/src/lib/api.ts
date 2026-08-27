// Слой данных ProLatex.
// Пытается получить данные из headless WordPress (prolatex-core), при недоступности —
// использует локальные data/*.json как единственный резервный источник правды.
// Сайт обязан полноценно работать без запущенного WP.

import mattressesJson from "@/data/mattresses.json";
import pillowsJson from "@/data/pillows.json";
import toppersJson from "@/data/toppers.json";
import contentJson from "@/data/content.json";
import type {
  MattressesData,
  MattressModel,
  PillowsData,
  ToppersData,
  ContentData,
  ArticleRef,
} from "./types";

const WP_BASE = process.env.WP_API_URL || "http://localhost:8890/wp-json";
const REVALIDATE_SECONDS = 300;
const FETCH_TIMEOUT_MS = 1200;

const localMattresses = mattressesJson as MattressesData;
const localPillows = pillowsJson as PillowsData;
const localToppers = toppersJson as ToppersData;
const localContent = contentJson as ContentData;

/**
 * Пробует получить JSON с WP REST API. При любой ошибке (WP не запущен,
 * таймаут, некорректный ответ) — возвращает null, вызывающая функция
 * откатывается на локальные данные.
 */
async function tryWpFetch<T>(path: string): Promise<T | null> {
  if (process.env.WP_DISABLED === "1") return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(`${WP_BASE}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getMattressesData(): Promise<MattressesData> {
  const wp = await tryWpFetch<MattressesData>("/prolatex/v1/mattresses");
  return wp ?? localMattresses;
}

export async function getPillowsData(): Promise<PillowsData> {
  const wp = await tryWpFetch<PillowsData>("/prolatex/v1/pillows");
  const data = wp ?? localPillows;
  if (!data.retail_line) return data;
  return {
    ...data,
    retail_line: {
      ...data.retail_line,
      models: data.retail_line.models.filter((m) => !m.hidden),
    },
  };
}

export async function getToppersData(): Promise<ToppersData> {
  const wp = await tryWpFetch<ToppersData>("/prolatex/v1/toppers");
  if (!wp) return localToppers;
  return { ...wp, models: wp.models ?? localToppers.models };
}

export async function getContentData(): Promise<ContentData> {
  const wp = await tryWpFetch<ContentData>("/prolatex/v1/content");
  return wp ?? localContent;
}

export async function getAllMattresses(): Promise<MattressModel[]> {
  const data = await getMattressesData();
  return [...data.models].sort((a, b) => a.order - b.order);
}

export async function getMattressBySlug(
  slug: string
): Promise<MattressModel | null> {
  const models = await getAllMattresses();
  return models.find((m) => m.slug === slug) ?? null;
}

export async function getMattressesByCategory(
  categorySlug: string
): Promise<MattressModel[]> {
  const models = await getAllMattresses();
  return models.filter((m) => m.category === categorySlug);
}

export async function getRelatedMattresses(
  slug: string,
  limit = 3
): Promise<MattressModel[]> {
  const model = await getMattressBySlug(slug);
  const all = await getAllMattresses();
  if (!model) return all.slice(0, limit);
  const sameCategory = all.filter(
    (m) => m.category === model.category && m.slug !== slug
  );
  const others = all.filter(
    (m) => m.category !== model.category && m.slug !== slug
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getArticleRefs(): Promise<ArticleRef[]> {
  const content = await getContentData();
  return content.articles;
}

export function getSyncMattressesData(): MattressesData {
  return localMattresses;
}

export function getSyncContentData(): ContentData {
  return localContent;
}

export function getSyncPillowsData(): PillowsData {
  return localPillows;
}

export function getSyncToppersData(): ToppersData {
  return localToppers;
}
