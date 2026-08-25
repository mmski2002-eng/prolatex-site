import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

/**
 * On-demand ревалидация блога. Вызывается из WordPress при сохранении статьи.
 * POST /api/revalidate  { secret, slug? }
 * Секрет сверяется с PARTNER_SECRET (общий с WP).
 */
export async function POST(request: NextRequest) {
  let body: { secret?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const secret = process.env.PARTNER_SECRET ?? "";
  if (!secret || body.secret !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (body.slug) {
    revalidatePath(`/blog/${body.slug}`);
  }
  return NextResponse.json({ ok: true, revalidated: true, slug: body.slug ?? null });
}
