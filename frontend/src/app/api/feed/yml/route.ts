import { NextRequest, NextResponse } from "next/server";
import { verifyPartnerToken } from "@/lib/partner-token";
import { getAllMattresses, getPillowsData } from "@/lib/api";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

/**
 * Товарный фид для партнёров в формате YML (Yandex Market Language).
 * GET /api/feed/yml/            — боевой фид: офферы включаются только при наличии цены
 *                                 (цены появятся в data/*.json → фид наполнится автоматически).
 * GET /api/feed/yml/?test=1     — тестовый режим для проверки загрузки фида на стороне
 *                                 партнёра: те же товары с тестовой ценой 9999 ₽ и пометкой.
 *
 * Передаёт: товары, цены, изображения, характеристики (param).
 */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface FeedOffer {
  id: string;
  name: string;
  url: string;
  price: number | null;
  categoryId: number;
  picture?: string;
  description: string;
  params: { name: string; value: string; unit?: string }[];
}

export async function GET(req: NextRequest) {
  if (!verifyPartnerToken(req.nextUrl.searchParams.get("t"))) {
    return NextResponse.json(
      { error: "Фид доступен партнёрам: отправьте заявку на /optovym-klientam/ и получите персональную ссылку" },
      { status: 403 }
    );
  }
  const testMode = req.nextUrl.searchParams.get("test") === "1";
  const [mattresses, pillows] = await Promise.all([
    getAllMattresses(),
    getPillowsData(),
  ]);

  const offers: FeedOffer[] = [];

  for (const m of mattresses) {
    offers.push({
      id: `mattress-${m.slug}`,
      name: `Матрас ${m.name}`,
      url: `${SITE_URL}/matrasy/${m.slug}/`,
      price: null, // появится в данных вместе с прайсом
      categoryId: 1,
      picture: m.image ? `${SITE_URL}${m.image}` : undefined,
      description: m.summary,
      params: [
        { name: "Высота", value: String(m.height_cm), unit: "см" },
        { name: "Жёсткость", value: m.firmness },
        { name: "Латекс суммарно", value: String(m.latex_total_cm), unit: "см" },
        { name: "Максимальная нагрузка на спальное место", value: "150", unit: "кг" },
        { name: "Тип", value: m.category === "bespruzhinnye" ? "Беспружинный" : m.category === "s-topperom" ? "Пружинный с топпером" : "Пружинный" },
      ],
    });
  }

  for (const p of pillows.retail_line?.models ?? []) {
    offers.push({
      id: `pillow-${p.base_model.toLowerCase()}`,
      name: `Латексная подушка ${p.name}`,
      url: `${SITE_URL}/podushki/`,
      price: null,
      categoryId: 2,
      picture: p.image ? `${SITE_URL}${p.image}` : undefined,
      description: `Латексная подушка ${p.name} на базе формы ${p.base_model}. Упаковка: ${p.packaging.toLowerCase()}.`,
      params: [
        { name: "Длина", value: String(p.length_mm / 10), unit: "см" },
        { name: "Ширина", value: String(p.width_mm / 10), unit: "см" },
        { name: "Высота", value: String(p.height_mm / 10), unit: "см" },
        { name: "Форма", value: p.base_model },
        { name: "Материал", value: "Натуральный латекс (Dunlop)" },
      ],
    });
  }

  const published = offers
    .map((o) => (testMode && o.price === null ? { ...o, price: 9999 } : o))
    .filter((o) => o.price !== null);

  const date = new Date().toISOString().slice(0, 19);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${date}">
<shop>
<name>${esc(SITE_NAME)}</name>
<company>${esc(SITE_NAME)}</company>
<url>${SITE_URL}</url>
<currencies><currency id="RUR" rate="1"/></currencies>
<categories>
<category id="1">Латексные матрасы</category>
<category id="2">Латексные подушки</category>
</categories>
<offers>
${published
  .map(
    (o) => `<offer id="${esc(o.id)}" available="true">
<url>${esc(o.url)}</url>
<price>${o.price}</price>
<currencyId>RUR</currencyId>
<categoryId>${o.categoryId}</categoryId>
${o.picture ? `<picture>${esc(o.picture)}</picture>` : ""}
<name>${esc(o.name)}</name>
<vendor>ProLatex</vendor>
<description>${esc(o.description)}${testMode ? " [ТЕСТОВЫЙ ФИД: цена не является офертой]" : ""}</description>
${o.params.map((p) => `<param name="${esc(p.name)}"${p.unit ? ` unit="${esc(p.unit)}"` : ""}>${esc(p.value)}</param>`).join("\n")}
</offer>`
  )
  .join("\n")}
</offers>
</shop>
</yml_catalog>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
