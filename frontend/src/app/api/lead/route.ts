import { NextResponse, type NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isValidEmail, isValidRuPhone } from "@/lib/format";
import type { LeadPayload } from "@/lib/types";
import { issuePartnerToken } from "@/lib/partner-token";

export const runtime = "nodejs";

const WP_BASE = process.env.WP_API_URL || "http://localhost:8890/wp-json";
const FALLBACK_PATH = path.join(process.cwd(), "leads-fallback.json");
const FETCH_TIMEOUT_MS = 2000;

// Простейший rate-limit в памяти процесса: не более 5 заявок за 10 минут с одного IP.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return true;
}

function sanitize(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

async function appendFallback(entry: Record<string, unknown>): Promise<void> {
  let list: unknown[] = [];
  try {
    const raw = await fs.readFile(FALLBACK_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) list = parsed;
  } catch {
    list = [];
  }
  list.push(entry);
  await fs.writeFile(FALLBACK_PATH, JSON.stringify(list, null, 2), "utf-8");
}

async function tryForwardToWp(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(`${WP_BASE}/prolatex/v1/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок. Попробуйте позже." },
      { status: 429 }
    );
  }

  let body: Partial<LeadPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  // Honeypot: боты заполняют скрытое поле — тихо "принимаем" заявку, но не сохраняем.
  if (sanitize(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitize(body.name, 120);
  const phone = sanitize(body.phone, 32);
  const email = sanitize(body.email, 160);
  const message = sanitize(body.message, 1000);
  const source = sanitize(body.source, 80) || "unknown";
  const model = sanitize(body.model, 120);
  const size = sanitize(body.size, 40);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Некорректное имя";
  if (!isValidRuPhone(phone)) errors.phone = "Некорректный телефон";
  if (email && !isValidEmail(email)) errors.email = "Некорректный e-mail";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const payload = {
    name,
    phone,
    email: email || undefined,
    message: message || undefined,
    source,
    model: model || undefined,
    size: size || undefined,
    createdAt: new Date().toISOString(),
    ip,
  };

  const forwarded = await tryForwardToWp(payload);
  if (!forwarded) {
    try {
      await appendFallback(payload);
    } catch (err) {
      console.error("Не удалось записать заявку в leads-fallback.json", err);
      return NextResponse.json(
        { ok: false, error: "Не удалось сохранить заявку" },
        { status: 500 }
      );
    }
  }

  if (String(payload.source ?? "").startsWith("b2b")) {
    const t = issuePartnerToken();
    return NextResponse.json({
      ok: true,
      unlock: {
        token: t,
        materials: [
          { title: "Фотографии товаров (ZIP)", href: `/api/partner/prolatex-foto-tovarov.zip?t=${t}` },
          { title: "Сертификат соответствия (PDF)", href: `/api/partner/sertifikat-sootvetstviya-lateks-2027.pdf?t=${t}` },
          { title: "Товарный фид YML", href: `/api/feed/yml/?t=${t}` },
        ],
      },
    });
  }
  return NextResponse.json({ ok: true });
}
