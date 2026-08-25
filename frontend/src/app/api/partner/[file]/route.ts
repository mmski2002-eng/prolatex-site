import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyPartnerToken } from "@/lib/partner-token";

/**
 * Выдача партнёрских материалов по подписанному токену.
 * GET /api/partner/<file>?t=<token>
 * Файлы лежат в frontend/private-materials/ (вне public).
 */

const FILES: Record<string, { disk: string; type: string }> = {
  "prolatex-foto-tovarov.zip": {
    disk: "prolatex-foto-tovarov.zip",
    type: "application/zip",
  },
  "sertifikat-sootvetstviya-lateks-2027.pdf": {
    disk: "sertifikat-sootvetstviya-lateks-2027.pdf",
    type: "application/pdf",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const entry = FILES[file];
  if (!entry) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!verifyPartnerToken(req.nextUrl.searchParams.get("t"))) {
    return NextResponse.json(
      { error: "Материалы доступны после отправки заявки на странице «Оптовым клиентам»" },
      { status: 403 }
    );
  }
  const diskPath = path.join(process.cwd(), "private-materials", entry.disk);
  try {
    const data = await readFile(diskPath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": entry.type,
        "Content-Disposition": `attachment; filename="${entry.disk}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "file unavailable" }, { status: 500 });
  }
}
