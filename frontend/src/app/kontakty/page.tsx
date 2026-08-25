import type { Metadata } from "next";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: { absolute: "Контакты компании Про-Латекс: адрес, телефон, e-mail" },
  description:
    "Контакты Про-Латекс: телефон, e-mail и форма заявки. Поможем выбрать матрас, подушку или топпер из натурального латекса.",
  alternates: { canonical: "/kontakty/" },
  openGraph: ogMeta({ url: "/kontakty/" }),
};

export default function KontaktyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Контакты", path: "/kontakty/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Контакты</h1>
          <p className="lead">Свяжитесь с нами любым удобным способом — ответим в рабочее время.</p>
        </div>
      </section>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap two-col">
          <div>
            <div className="spec-table">
              <div className="spec-row"><span>Телефон</span><b><a href="tel:88047007750">8 (804) 700-77-50</a></b></div>
              <div className="spec-row"><span>E-mail</span><b><a href="mailto:info@pro-latex.ru">info@pro-latex.ru</a></b></div>
              <div className="spec-row"><span>Режим работы</span><b>Ежедневно, 9:00–20:00</b></div>
              <div className="spec-row">
                <span>Адрес склада</span>
                <b>195030, Санкт-Петербург, ул.&nbsp;Электропультовцев, д.&nbsp;7, литера&nbsp;Н</b>
              </div>
              <div className="spec-row"><span>Основана</span><b>в 2009 году</b></div>
              <div className="spec-row"><span>Продавец</span><b>ИП Карцев Алексей Сергеевич</b></div>
              <div className="spec-row"><span>ИНН</span><b>504905850767</b></div>
              <div className="spec-row"><span>ОГРНИП</span><b>324508100606552 от 25.10.2024</b></div>
            </div>
            <div
              className="cell mt-24"
              style={{ border: "1px solid var(--line)", height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}
              aria-label="Карта расположения (заглушка)"
            >
              <p style={{ color: "var(--gray-soft)" }}>Карта — уточняется</p>
            </div>
          </div>
          <LeadForm source="kontakty-page" title="Написать нам" subtitle="Ответим на вопросы о моделях, размерах и сроках изготовления." />
        </div>
      </section>
    </>
  );
}
