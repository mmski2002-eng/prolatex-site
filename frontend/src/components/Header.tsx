"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const MATRASY_LINKS = [
  { href: "/matrasy/", label: "Все матрасы" },
  { href: "/matrasy/pruzhinnye/", label: "Пружинные" },
  { href: "/matrasy/bespruzhinnye/", label: "Беспружинные" },
  { href: "/matrasy/s-topperom/", label: "С топпером" },
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
