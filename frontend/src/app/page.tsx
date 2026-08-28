import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getAllMattresses,
  getContentData,
  getMattressesData,
} from "@/lib/api";
import {faqJsonLd, itemListJsonLd, ogMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { articleCover } from "@/lib/covers";
import ModelCard from "@/components/ModelCard";
import FaqAccordion from "@/components/FaqAccordion";
import QuizModal from "@/components/QuizModal";
import LeadForm from "@/components/LeadForm";
import VideoBlock from "@/components/VideoBlock";
import { LayerList } from "@/components/LayerDiagram";
import OriginBadge from "@/components/OriginBadge";

export const metadata: Metadata = {
  title: { absolute: "Матрасы из натурального бельгийского латекса | Про-Латекс" },
  description:
    "Про-Латекс — матрасы, подушки и тонкие матрасы из 100% натурального бельгийского латекса. Гипоаллергенность, срок службы 15–20 лет, подбор по весу и позе сна.",
  alternates: { canonical: "/" },
  openGraph: ogMeta({
    url: "/",
    title: "Про-Латекс — матрасы из 100% натурального бельгийского латекса",
    description:
      "Гипоаллергенность, срок службы 15–20 лет, подбор по весу и позе сна.",
  }),
};

const TRUST = [
  {
    title: "100% бельгийский латекс",
    text: "Novaya — европейское сырьё без синтетических подмесов в основе линейки.",
  },
  {
    title: "580 пружин на спальное место",
    text: "Независимый пружинный блок с 7 зонами — вдвое больше пружин, чем в стандартных блоках.",
  },
  {
    title: "Срок службы 15–20 лет",
    text: "Латекс не проседает и не образует ям — деформация за десятилетие составляет единицы процентов.",
  },
  {
    title: "Нагрузка до 150 кг",
    text: "Каждая модель рассчитана на серьёзный вес на спальное место без потери формы.",
  },
];

export default async function HomePage() {
  const [content, mattressesData, models] = await Promise.all([
    getContentData(),
    getMattressesData(),
    getAllMattresses(),
  ]);
  const featured = models.slice(0, 6);
  const flagshipLayers = models.find((m) => m.slug === "eco-latex") ?? models[0];

  return (
    <>
      <JsonLd
        data={faqJsonLd(content.faq.map((f) => ({ q: f.q, a: f.a })))}
      />
      <JsonLd
        data={itemListJsonLd(
          models.map((m) => ({ name: m.name, url: `/matrasy/${m.slug}/` })),
          "Латексные матрасы Про-Латекс"
        )}
      />

      <section className="hero hero-static hero-photo">
        <div className="hero-inner wrap">
          <OriginBadge />
          <div className="hero-grid hero-grid-single">
            <div>
              <div className="badge">
                <span className="dot" /> Специалист по натуральному латексу. Компания основана в 2009 году
              </div>
              <h1>Матрасы из 100% натурального бельгийского латекса</h1>
              <p className="sub">
                Сок дерева гевеи вместо синтетики. Анатомическая поддержка
                позвоночника, гипоаллергенность и срок службы 15–20 лет.
                9 моделей матрасов, латексные подушки и тонкие матрасы под любой вес и
                позу сна.
              </p>
              <div className="hero-ctas">
                <QuizModal models={models} label="Подобрать матрас по весу и жёсткости" className="btn btn-eco" />
                <Link href="/matrasy/" className="btn btn-outline">
                  Смотреть каталог матрасов
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="num">100%</span>
                  <span>натуральный латекс</span>
                </div>
                <div className="stat">
                  <span className="num">15–20 лет</span>
                  <span>срок службы</span>
                </div>
                <div className="stat">
                  <span className="num">9 моделей</span>
                  <span>матрасов + подушки и тонкие матрасы</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Модели матрасов">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Модели</div>
            <h2>Популярные латексные матрасы Про-Латекс</h2>
          </div>
          <div className="model-grid">
            {featured.map((m) => (
              <ModelCard model={m} key={m.slug} />
            ))}
          </div>
          <div className="center mt-40">
            <Link href="/matrasy/" className="btn btn-primary">
              Весь каталог из 9 моделей
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Почему Про-Латекс">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Почему Про-Латекс</div>
            <h2>Четыре факта о натуральном латексе</h2>
          </div>
          <div className="grid-4">
            {TRUST.map((item) => (
              <div className="cell" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tint" aria-label="Каталог">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Каталог</div>
            <h2>Матрасы, подушки и тонкие матрасы из латекса</h2>
            <p>Две конструкции матрасов, готовая линейка латексных подушек и листовой латекс на тонкие матрасы — весь спальный комплект из одного материала.</p>
          </div>
          <div className="cat-grid">
            {[
              {
                href: "/matrasy/pruzhinnye/",
                label: "Матрасы",
                title: "Пружинные",
                text: "Бельгийский латекс + независимый пружинный блок с 7 анатомическими зонами.",
                img: "/img/mattress/pruzhinnyy-matras-v-razreze.webp",
              },
              {
                href: "/matrasy/bespruzhinnye/",
                label: "Матрасы",
                title: "Беспружинные",
                text: "Монолитные блоки цельного латекса 10–26 см — точечная поддержка без пружин.",
                img: "/img/mattress/bespruzhinnyy-lateks-pod-chekhlom.webp",
              },
              {
                href: "/podushki/",
                label: "Подушки",
                title: "Латексные подушки",
                text: "Две готовые модели с наполнителем из перфорированного бельгийского латекса.",
                img: "/img/pillows/prolatex-pillow-v-chekhle.webp",
              },
              {
                href: "/toppery/",
                label: "Тонкие матрасы",
                title: "Тонкие латексные матрасы",
                text: "Листовой латекс 20–50 мм — обновите старый матрас без замены.",
                img: "/img/toppers/topper-cover-open.webp",
              },
            ].map((c) => (
              <Link className="cat-card" href={c.href} key={c.href}>
                <span className="cat-card-media">
                  <Image src={c.img} alt={c.title} fill sizes="(max-width: 640px) 100vw, 380px" />
                </span>
                <span className="cat-card-body">
                  <span className="cat-label">{c.label}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="cat-more">
                    Смотреть
                    <svg className="cat-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="quiz-section" aria-label="Подбор матраса" className="tint">
        <div className="wrap quiz-banner">
          <div>
            <div className="section-tag">Квиз-подбор</div>
            <h2>Не знаете, какой матрас выбрать?</h2>
            <p className="mt-16" style={{ color: "var(--gray)", maxWidth: 560 }}>
              Ответьте на четыре вопроса — про вес, позу сна, жёсткость и тип
              конструкции — и мы покажем 2–3 подходящие модели с объяснением, почему.
            </p>
          </div>
          <QuizModal models={models} label="Пройти подбор за минуту" className="btn btn-eco quiz-banner-btn" />
        </div>
      </section>

      <section className="tint" aria-label="Анатомия матраса">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Анатомия матраса</div>
            <h2>Из чего состоит латексный матрас</h2>
            <p>
              Слой за слоем на примере модели Eco Latex: от съёмного чехла до
              независимого пружинного блока с 7 анатомическими зонами. Ширина
              полосы — реальная доля слоя в высоте матраса.
            </p>
          </div>
          {flagshipLayers && (
            <div className="layers-grid anatomy-grid">
              <div className="anatomy-photo">
                <Image
                  src="/img/mattress/pruzhinnyy-matras-v-razreze.webp"
                  alt="Матрас Eco Latex в разрезе: слои латекса и независимый пружинный блок"
                  width={1200}
                  height={588}
                  sizes="(max-width: 900px) 100vw, 600px"
                  style={{ width: "100%", height: "auto" }}
                />
                <p className="anatomy-caption">
                  Слои бельгийского латекса и независимый пружинный блок в разрезе
                </p>
              </div>
              <LayerList layers={flagshipLayers.layers} />
            </div>
          )}
        </div>
      </section>

      <section className="tint" aria-label="Технология">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Технология</div>
            <h2>Dunlop — классическая вулканизация латекса</h2>
          </div>
          <div className="grid-2">
            {content.technologies
              .filter((tech) => tech.slug === "dunlop")
              .map((tech) => (
                <div className="cell" key={tech.slug}>
                  <span className="tag sand">{tech.badge}</span>
                  <h3 className="mt-16">{tech.name}</h3>
                  <p className="mt-8">{tech.description}</p>
                </div>
              ))}
            <div className="cell">
              <span className="tag">Сертифицировано</span>
              <h3 className="mt-16">Сертификат соответствия</h3>
              <p className="mt-8">
                Латекс сертифицирован в системе «Промтехстандарт», сертификат
                действителен до 26.11.2027 — подробности и PDF на странице
                технологии.
              </p>
            </div>
          </div>
          <div className="center mt-40">
            <Link href="/tehnologii/" className="btn btn-outline">
              Подробнее о технологии Dunlop
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Причины выбрать латекс">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">10 причин</div>
            <h2>Почему натуральный латекс лучше пенополиуретана</h2>
          </div>
          <div className="grid-2">
            {content.reasons10.slice(0, 6).map((r) => (
              <div className="cell reason-cell" key={r.n}>
                <span className="reason-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <path d="M12 3C7 7.5 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-2-6.5-7-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M12 21v-8m0 0 3-3m-3 3-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-16">{r.title}</h3>
                <p className="mt-8">{r.text}</p>
              </div>
            ))}
          </div>
          <div className="center mt-40">
            <Link href="/o-latekse/" className="btn btn-outline">
              Смотреть все 10 причин
            </Link>
          </div>
        </div>
      </section>

      <section className="tint" aria-label="Производство">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Производство</div>
            <h2>От сырья до готового блока латекса</h2>
          </div>
          <VideoBlock filename="Latexco + Artilat (OLD)-Video.mp4" title="Обзор производства латекса" />
          <div className="center mt-40">
            <Link href="/proizvodstvo/" className="btn btn-outline">
              Все ролики о производстве
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Отзывы">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Отзывы</div>
            <h2>Что говорят покупатели</h2>
          </div>
          <div className="reviews-grid">
            {content.reviews.map((r) => (
              <div className="review-card" key={r.name}>
                <p className="text">«{r.text}»</p>
                <div className="review-name">{r.name} · {r.model}</div>
                <div className="review-city">{r.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tint" aria-label="Частые вопросы">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Вопросы и ответы</div>
            <h2>Частые вопросы о латексных матрасах</h2>
          </div>
          <FaqAccordion items={content.faq} />
        </div>
      </section>

      <section aria-label="Блог">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Блог</div>
            <h2>Экспертные статьи о латексе</h2>
          </div>
          <div className="blog-grid">
            {content.articles.slice(0, 3).map((a) => (
              <Link className="blog-card" href={`/blog/${a.slug}/`} key={a.slug}>
                <span className="blog-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image src={articleCover(a.slug)} alt="" fill sizes="(max-width: 640px) 100vw, 380px" />
                </span>
                <span className="blog-card-body">
                  <h3>{a.title}</h3>
                  <span className="blog-read">Читать статью →</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="center mt-40">
            <Link href="/blog/" className="btn btn-outline">
              Все статьи блога
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section" aria-label="Заявка">
        <div className="wrap cta-grid">
          <div>
            <h2>Оставьте заявку — поможем выбрать матрас</h2>
            <p>Расскажите о весе, позе сна и бюджете — консультант подберёт модель и рассчитает точную стоимость.</p>
            <div className="cta-contacts">
              <a href="tel:88047007750">8 (804) 700-77-50</a>
              <a href="mailto:info@pro-latex.ru">info@pro-latex.ru</a>
            </div>
          </div>
          <LeadForm source="home-cta" />
        </div>
      </section>
    </>
  );
}
