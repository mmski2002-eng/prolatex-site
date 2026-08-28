import type { Metadata } from "next";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: { absolute: "Контакты компании Про-Латекс: адрес, телефон, e-mail" },
  description:
    "Контакты Про-Латекс: телефон, e-mail и форма заявки. Поможем выбрать матрас, подушку или тонкий матрас из натурального латекса.",
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
                <span>Склады</span>
                <b>Москва и Санкт-Петербург</b>
              </div>
              <div className="spec-row"><span>Основана</span><b>в 2009 году</b></div>
              <div className="spec-row"><span>Продавец</span><b>ИП Карцев Алексей Сергеевич</b></div>
              <div className="spec-row"><span>ИНН</span><b>504905850767</b></div>
              <div className="spec-row"><span>ОГРНИП</span><b>324508100606552 от 25.10.2024</b></div>
            </div>
            <div
              className="mt-24"
              style={{ border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden", height: 320 }}
            >
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=30.476259,59.972016&z=17&pt=30.476259,59.972016,pm2rdm"
                width="100%"
                height="320"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, display: "block" }}
                title="Карта: склад Про-Латекс, Санкт-Петербург"
              />
            </div>
          </div>
          <LeadForm source="kontakty-page" title="Написать нам" subtitle="Ответим на вопросы о моделях, размерах и сроках изготовления." />
        </div>
      </section>
    </>
  );
}
