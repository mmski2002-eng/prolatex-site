// Слой данных блога: статьи из WordPress (админка) + статический фолбэк
// из data/articles.ts. WP-версия побеждает по slug; при недоступности WP
// сайт полноценно работает на статических статьях.

import { ARTICLES, getArticleBySlug, type Article, type ArticleBlock } from "@/data/articles";
import { headingId } from "@/lib/inline";

export interface BlogListItem {
  slug: string;
  title: string;
  metaTitle?: string;
  excerpt: string;
  leadRich?: string;
  dateISO: string;
  tag: string;
  /** Абсолютный URL обложки из WP; для статических — undefined (берётся articleCover). */
  cover?: string;
}

export interface BlogArticle extends BlogListItem {
  /** Статические статьи — структурированные блоки. */
  blocks?: ArticleBlock[];
  /** WP-статьи — готовый HTML контента. */
  html?: string;
}

interface WpArticle {
  slug: string;
  title: string;
  excerpt: string;
  lead: string;
  tag: string;
  dateISO: string;
  cover: string;
  html?: string;
}

const WP_BASE = process.env.WP_API_URL || "http://localhost:8890/wp-json";
const REVALIDATE = 300;
const TIMEOUT_MS = 1500;

async function wpFetch<T>(path: string): Promise<T | null> {
  if (process.env.WP_DISABLED === "1") return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${WP_BASE}${path}`, {
      next: { revalidate: REVALIDATE },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function staticToItem(a: Article): BlogListItem {
  return {
    slug: a.slug,
    title: a.title,
    metaTitle: a.metaTitle,
    excerpt: a.excerpt,
    leadRich: a.leadRich,
    dateISO: a.dateISO,
    tag: a.tag,
  };
}

function wpToItem(w: WpArticle): BlogListItem {
  return {
    slug: w.slug,
    title: w.title,
    excerpt: w.excerpt,
    leadRich: w.lead || undefined,
    dateISO: w.dateISO,
    tag: w.tag || "Блог",
    cover: w.cover || undefined,
  };
}

/** Список статей для листинга: WP впереди (по дате), затем статические без дублей. */
export async function getBlogArticles(): Promise<BlogListItem[]> {
  const staticItems = ARTICLES.map(staticToItem);
  const wp = await wpFetch<WpArticle[]>("/prolatex/v1/articles");
  if (!wp || wp.length === 0) return staticItems;
  const wpItems = wp.map(wpToItem);
  const wpSlugs = new Set(wpItems.map((w) => w.slug));
  const staticOnly = staticItems.filter((s) => !wpSlugs.has(s.slug));
  return [...wpItems, ...staticOnly];
}

/** Одна статья: сначала WP (HTML), при отсутствии — статическая (блоки). */
export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  const wp = await wpFetch<WpArticle>(`/prolatex/v1/articles/${slug}`);
  if (wp && wp.slug) {
    return { ...wpToItem(wp), html: wp.html };
  }
  const s = getArticleBySlug(slug);
  if (!s) return null;
  return { ...staticToItem(s), blocks: s.blocks };
}

/** Слаги статических статей для generateStaticParams (WP-статьи рендерятся динамически). */
export function staticArticleSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

export interface TocItem {
  id: string;
  text: string;
}

/**
 * Для WP-HTML: проставляет id на <h2> и собирает оглавление.
 * Возвращает html с якорями и список пунктов TOC.
 */
export function withHeadingAnchors(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const out = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (_m, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const id = headingId(text);
      toc.push({ id, text });
      if (/\bid=/.test(attrs)) return `<h2${attrs}>${inner}</h2>`;
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    }
  );
  return { html: out, toc };
}
