import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd, type BreadcrumbEntry } from "@/lib/seo";

export default function Breadcrumbs({ items }: { items: BreadcrumbEntry[] }) {
  const full: BreadcrumbEntry[] = [{ name: "Главная", path: "/" }, ...items];
  return (
    <nav className="breadcrumbs wrap" aria-label="Хлебные крошки">
      <JsonLd data={breadcrumbJsonLd(full)} />
      <ol>
        {full.map((item, i) => (
          <li key={item.path}>
            {i === full.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
