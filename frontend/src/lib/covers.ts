/** Обложки статей блога — реальные фото продукции (рендеры и съёмка подушек). */
export const ARTICLE_COVERS: Record<string, string> = {
  "10-prichin-vybrat-lateks": "/img/blog/10-prichin-vybrat-lateks/cover.webp",
  "chto-takoe-naturalnyj-lateks": "/img/blog/chto-takoe-naturalnyj-lateks/cover.webp",
  "dunlop-i-pulse": "/img/blog/dunlop-i-pulse/cover.webp",
  "kak-vybrat-zhestkost": "/img/blog/kak-vybrat-zhestkost/cover.webp",
  "lateksnaya-podushka-kak-vybrat": "/img/blog/lateksnaya-podushka-kak-vybrat/cover.webp",
  "topper-iz-lateksa": "/img/blog/topper-iz-lateksa/cover.webp",
  "matras-iz-lateksa-plyusy-i-minusy": "/img/blog/matras-iz-lateksa-plyusy-i-minusy/cover.webp",
  "matras-s-lateksom-ili-pruzhinnyj": "/img/blog/matras-s-lateksom-ili-pruzhinnyj/cover.webp",
  "rossijskij-ili-importnyj-lateksnyj-matras": "/img/blog/rossijskij-ili-importnyj-lateksnyj-matras/cover.webp",
};

export function articleCover(slug: string): string {
  return ARTICLE_COVERS[slug] ?? "/img/mattress/latex-block-dia.webp";
}
