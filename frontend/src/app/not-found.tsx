import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap">
        <div className="code" aria-hidden="true">404</div>
        <h1 className="page-h1 mt-16">Страница не найдена</h1>
        <p className="lead" style={{ margin: "0 auto 32px" }}>
          Возможно, страница была перемещена или удалена. Попробуйте начать с
          каталога или главной страницы.
        </p>
        <div className="hero-ctas" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">На главную</Link>
          <Link href="/matrasy/" className="btn btn-outline">Каталог матрасов</Link>
        </div>
      </div>
    </section>
  );
}
