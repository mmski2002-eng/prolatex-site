import type { MetadataRoute } from "next";
import { getAllMattresses, getMattressesData } from "@/lib/api";
import { getBlogArticles } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

const STATIC_PATHS = [
  "/",
  "/matrasy/",
  "/podushki/",
  "/toppery/",
  "/tehnologii/",
  "/o-latekse/",
  "/proizvodstvo/",
  "/podbor/",
  "/blog/",
  "/dostavka-i-oplata/",
  "/o-kompanii/",
  "/kontakty/",
  "/politika-konfidencialnosti/",
  "/polzovatelskoe-soglashenie/",
  "/optovym-klientam/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [data, models, articles] = await Promise.all([
    getMattressesData(),
    getAllMattresses(),
    getBlogArticles(),
  ]);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = data.categories.map((c) => ({
    url: `${SITE_URL}/matrasy/${c.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const modelEntries: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${SITE_URL}/matrasy/${m.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}/`,
    lastModified: a.dateISO,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...modelEntries, ...articleEntries];
}
