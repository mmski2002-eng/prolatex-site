import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
import {articleJsonLd, ogMeta } from "@/lib/seo";
import { renderInline, headingId } from "@/lib/inline";
import { articleCover } from "@/lib/covers";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const seoTitle = article.metaTitle ?? article.title;
  return {
    title: article.metaTitle ? { absolute: article.metaTitle } : article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: ogMeta({
      url: `/blog/${slug}/`,
      type: "article",
      title: seoTitle,
      description: article.excerpt,
    }),
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const others = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);
  const tocItems = article.blocks
    .filter((b): b is { type: "h2"; text: string } => b.type === "h2")
    .map((b) => ({ id: headingId(b.text), text: b.text }));

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Блог", path: "/blog/" },
          { name: article.title, path: `/blog/${slug}/` },
        ]}
      />
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt,
          url: `/blog/${slug}/`,
          datePublished: article.dateISO,
        })}
      />
      <section style={{ paddingTop: 8, paddingBottom: 0 }}>
        <div className="wrap article-hero">
          <div>
            <span className="tag sand">{article.tag}</span>
            <h1 className="page-h1 mt-16">{article.title}</h1>
            <p className="lead">{renderInline(article.leadRich ?? article.excerpt)}</p>
          </div>
          <div className="article-hero-media" aria-hidden="true">
            <Image
              src={articleCover(slug)}
              alt=""
              width={900}
              height={700}
              sizes="(max-width: 900px) 100vw, 380px"
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="article-body">
            {tocItems.length > 1 && (
              <nav className="article-toc" aria-label="Содержание статьи">
                <p className="article-toc-title">Содержание</p>
                <ul>
                  {tocItems.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}>{t.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {article.blocks.map((block, i) => {
              if (block.type === "h2")
                return (
                  <h2 key={i} id={headingId(block.text)}>
                    {block.text}
                  </h2>
                );
              if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
              if (block.type === "ul")
                return (
                  <ul key={i}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              if (block.type === "ol")
                return (
                  <ol key={i}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                );
              if (block.type === "img")
                return (
                  <figure className="article-img" key={i}>
                    <Image
                      src={block.src}
                      alt={block.alt}
                      width={1200}
                      height={675}
                      sizes="(max-width: 760px) 100vw, 760px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </figure>
                );
              if (block.type === "table")
                return (
                  <div className="article-table-wrap" key={i}>
                    <table className="article-table">
                      <thead>
                        <tr>
                          {block.header.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, r) => (
                          <tr key={r}>
                            {row.map((cell, c) => (
                              <td key={c}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              return <p key={i}>{renderInline(block.text)}</p>;
            })}
          </div>
        </div>
      </section>
      <section className="tint" aria-label="Другие статьи">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">Читайте также</div>
            <h2>Другие статьи блога</h2>
          </div>
          <div className="blog-grid">
            {others.map((a) => (
              <Link className="blog-card" href={`/blog/${a.slug}/`} key={a.slug}>
                <span className="blog-card-media">
                  <Image src={articleCover(a.slug)} alt="" fill sizes="(max-width: 640px) 100vw, 380px" />
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
