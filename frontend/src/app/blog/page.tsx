import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { articleCover } from "@/lib/covers";

export const metadata: Metadata = {
  title: "Блог о натуральном латексе: гайды и статьи",
  description:
    "Экспертные статьи о натуральном латексе: технологии Dunlop и Pulse, выбор жёсткости матраса, латексные подушки и топперы.",
  alternates: { canonical: "/blog/" },
  openGraph: ogMeta({ url: "/blog/" }),
};

export default function BlogPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Блог", path: "/blog/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Блог о натуральном латексе</h1>
          <p className="lead">
            Разбираем материал, технологии производства и практику выбора
            матраса, подушки и топпера из латекса.
          </p>
        </div>
      </section>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="blog-grid">
            {ARTICLES.map((a) => (
              <Link className="blog-card" href={`/blog/${a.slug}/`} key={a.slug}>
                <span className="blog-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={articleCover(a.slug)} alt="" width={900} height={700} loading="lazy" />
                </span>
                <span className="blog-card-body">
                  <span className="blog-tag">{a.tag}</span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <span className="blog-read">Читать статью →</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
