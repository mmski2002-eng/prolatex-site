"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { isValidEmail, isValidRuPhone, formatRuPhoneInput } from "@/lib/format";

type Status = "idle" | "loading" | "success" | "error";

export default function LeadForm({
  source,
  model,
  size,
  title = "Оставить заявку",
  subtitle = "Оставьте контакты — консультант перезвонит и поможет с выбором.",
  compact = false,
  contextLabel = "Модель",
  commentPlaceholder = "Например: интересует средняя жёсткость, размер 160×200",
}: {
  source: string;
  model?: string;
  size?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  /** Подпись контекстной строки («Модель» / «Формат» и т.п.). */
  contextLabel?: string;
  commentPlaceholder?: string;
}) {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "");

    const nextErrors: typeof errors = {};
    if (name.length < 2) nextErrors.name = "Введите имя (минимум 2 буквы)";
    if (!isValidRuPhone(phone)) nextErrors.phone = "Введите корректный номер телефона";
    if (email && !isValidEmail(email)) nextErrors.email = "Введите корректный e-mail";

    setErrors(nextErrors);
    setConsentError(!consent);
    if (Object.keys(nextErrors).length > 0 || !consent) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          message: message || undefined,
          source,
          model,
          size,
          website,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      // Партнёрская заявка: сервер вернул токен доступа к материалам —
      // сохраняем и оповещаем блок «Материалы для партнёров»
      try {
        const json = await res.json();
        if (json?.unlock) {
          localStorage.setItem("plx_partner_unlock", JSON.stringify(json.unlock));
          window.dispatchEvent(new CustomEvent("plx-partner-unlock"));
        }
      } catch {
        /* ответ без тела — не критично */
      }
      setStatus("success");
      form.reset();
      setPhone("");
      setConsent(false);
    } catch {
      setStatus("error");
      setErrorMessage("Не удалось отправить заявку. Позвоните нам по телефону или попробуйте ещё раз.");
    }
  }

  if (status === "success") {
    return (
      <div className="lead-form">
        <div className="form-alert success" role="status">
          Спасибо! Заявка отправлена — мы свяжемся с вами в ближайшее время.
        </div>
        <button type="button" className="btn btn-outline btn-block" onClick={() => setStatus("idle")}>
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      {!compact && (
        <>
          <h3>{title}</h3>
          <p className="fsub">{subtitle}</p>
        </>
      )}
      {status === "error" && (
        <div className="form-alert error" role="alert">
          {errorMessage}
        </div>
      )}
      {(model || size) && (
        <p className="fsub" style={{ marginBottom: 16 }}>
          {model && <>{contextLabel}: <b>{model}</b>. </>}
          {size && <>Размер: <b>{size}</b>.</>}
        </p>
      )}
      <div className={`field${errors.name ? " error" : ""}`}>
        <label htmlFor={`${formId}-name`}>Ваше имя</label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Как к вам обращаться"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <div className="err-msg">{errors.name}</div>}
      </div>
      <div className={`field${errors.phone ? " error" : ""}`}>
        <label htmlFor={`${formId}-phone`}>Телефон</label>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          maxLength={18}
          onFocus={() => phone === "" && setPhone("+7 ")}
          onChange={(e) => setPhone(formatRuPhoneInput(e.target.value))}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <div className="err-msg">{errors.phone}</div>}
      </div>
      <div className={`field${errors.email ? " error" : ""}`}>
        <label htmlFor={`${formId}-email`}>E-mail (необязательно)</label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <div className="err-msg">{errors.email}</div>}
      </div>
      <div className="field">
        <label htmlFor={`${formId}-message`}>Комментарий (необязательно)</label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={3}
          placeholder={commentPlaceholder}
        />
      </div>
      {/* honeypot — скрыто от людей, ловит ботов */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={`consent${consentError ? " error" : ""}`}>
        <input
          id={`${formId}-consent`}
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setConsentError(false);
          }}
          aria-invalid={consentError}
        />
        <label htmlFor={`${formId}-consent`}>
          Я даю согласие на обработку персональных данных и ознакомлен с{" "}
          <Link href="/politika-konfidencialnosti/">политикой конфиденциальности</Link>.
        </label>
      </div>
      {consentError && <div className="err-msg">Подтвердите согласие на обработку персональных данных</div>}
      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={status === "loading" || !consent}
      >
        {status === "loading" ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
