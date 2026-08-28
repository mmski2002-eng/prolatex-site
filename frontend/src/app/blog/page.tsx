import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { articleCover } from "@/lib/covers";
import { getBlogArticles } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог о натуральном латексе: гайды и статьи",
  description:
    "Экспертные статьи о натуральном латексе: технологии производства, выбор жёсткости матраса, латексные подушки и тонкие матрасы.",
  alternates: { canonical: "/blog/" },
  openGraph: ogMeta({ url: "/blog/" }),
};

export default async function BlogPage() {
  const articles = await getBlogArticles();
  return (
    <>
      <Breadcrumbs items={[{ name: "Блог", path: "/blog/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Блог о натуральном латексе</h1>
          <p className="lead">
            Разбираем материал, технологии производства и практику выбора
            матраса, подушки и тонкого матраса из латекса.
          </p>
        </div>
      </section>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="blog-grid">
            {articles.map((a) => (
              <Link className="blog-card" href={`/blog/${a.slug}/`} key={a.slug}>
                <span className="blog-card-media">
                  {a.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.cover} alt="" loading="lazy" />
                  ) : (
                    <Image src={articleCover(a.slug)} alt="" fill sizes="(max-width: 640px) 100vw, 380px" />
                  )}
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
