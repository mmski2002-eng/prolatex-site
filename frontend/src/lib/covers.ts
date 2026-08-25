/** Обложки статей блога — реальные фото продукции (рендеры и съёмка подушек). */
export const ARTICLE_COVERS: Record<string, string> = {
  "10-prichin-vybrat-lateks": "/img/mattress/latex-block-dia.webp",
  "chto-takoe-naturalnyj-lateks": "/img/pillows/k959-breezepillow-latex.webp",
  "dunlop-i-pulse": "/img/mattress/latex-block-dual.webp",
  "kak-vybrat-zhestkost": "/img/mattress/latex-block-ixal.webp",
  "lateksnaya-podushka-kak-vybrat": "/img/pillows/k235-easypillow.webp",
  "topper-iz-lateksa": "/img/mattress/topper-gelpulse.webp",
  "matras-iz-lateksa-plyusy-i-minusy": "/img/pillows/k558-breathsoft-cutaway.webp",
  "matras-s-lateksom-ili-pruzhinnyj": "/img/mattress/latex-block-dual.webp",
  "rossijskij-ili-importnyj-lateksnyj-matras": "/img/pillows/k313-sleepsoft-latex.webp",
};

export function articleCover(slug: string): string {
  return ARTICLE_COVERS[slug] ?? "/img/mattress/latex-block-dia.webp";
}
