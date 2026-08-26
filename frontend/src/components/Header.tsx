"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const MATRASY_LINKS = [
  { href: "/matrasy/", label: "Все матрасы" },
  { href: "/matrasy/pruzhinnye/", label: "Пружинные" },
  { href: "/matrasy/bespruzhinnye/", label: "Беспружинные" },
];

const NAV = [
  { href: "/podushki/", label: "Подушки" },
  { href: "/toppery/", label: "Топперы" },
  { href: "/tehnologii/", label: "Технологии" },
  { href: "/o-latekse/", label: "О латексе" },
  { href: "/proizvodstvo/", label: "Производство" },
  { href: "/blog/", label: "Блог" },
  { href: "/kontakty/", label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  // после клика по пункту дропдауна прячем панель, пока курсор не уйдёт
  // с .nav-item — иначе CSS :hover держит её открытой поверх новой страницы
  const [ddSuppressed, setDdSuppressed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href="/" className="logo" aria-label="Про-Латекс — на главную">
          <Image
            src="/logo-400.png"
            alt="Про-Латекс — натуральный латекс"
            width={256}
            height={64}
            style={{ height: 64, width: "auto" }}
            priority
          />
        </Link>
        <nav className="nav-links" aria-label="Основное меню">
          <div
            className={`nav-item${ddOpen ? " open" : ""}${ddSuppressed ? " suppressed" : ""}`}
            onMouseLeave={() => {
              setDdSuppressed(false);
              setDdOpen(false);
            }}
          >
            <button
              className="nav-link"
              type="button"
              aria-haspopup="true"
              aria-expanded={ddOpen}
              onClick={() => {
                setDdSuppressed(false);
                setDdOpen((v) => !v);
              }}
              onKeyDown={(e) => e.key === "Escape" && setDdOpen(false)}
            >
              Матрасы ▾
            </button>
            <div className="nav-dropdown">
              {MATRASY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => {
                    setDdOpen(false);
                    setDdSuppressed(true);
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <a className="nav-phone" href="tel:88047007750">
            8 (804) 700-77-50
          </a>
          <a
            className="nav-phone-icon"
            href="tel:88047007750"
            aria-label="Позвонить: 8 (804) 700-77-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
          <Link
            href="/podbor/"
            className="btn btn-primary"
            style={{ padding: "10px 18px", fontSize: 13.5 }}
          >
            Подобрать матрас
          </Link>
          <button
            className="burger"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <div
        id="mobile-nav"
        className={`mobile-nav${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        {MATRASY_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        {NAV.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/podbor/" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
          Подобрать матрас
        </Link>
      </div>
    </header>
  );
}
