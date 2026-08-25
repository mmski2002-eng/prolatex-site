export const SITE_URL = "https://pro-latex.ru";
export const SITE_NAME = "Про-Латекс";
export const SITE_NAME_EN = "ProLatex";
export const SITE_PHONE = "8 (804) 700-77-50";
export const SITE_PHONE_HREF = "tel:88047007750";
export const SITE_EMAIL = "info@pro-latex.ru";
export const SITE_FOUNDED = "2009";
export const SITE_ADDRESS = {
  full: "Санкт-Петербург, ул. Электропультовцев, д. 7, литера Н",
  streetAddress: "ул. Электропультовцев, д. 7, литера Н",
  addressLocality: "Санкт-Петербург",
  addressCountry: "RU",
};

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

/**
 * Полный openGraph-объект для страницы. Next шолово-мёржит metadata:
 * дочерний openGraph целиком затирает родительский из layout, поэтому
 * siteName/locale/images нужно отдавать с каждой страницы заново.
 */
export function ogMeta(opts: {
  url: string;
  title?: string;
  description?: string;
  type?: "website" | "article";
}) {
  return {
    type: opts.type ?? "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    url: absoluteUrl(opts.url),
    ...(opts.title ? { title: opts.title } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    images: [
      {
        url: absoluteUrl("/opengraph-image/"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — матрасы из 100% натурального латекса`,
      },
    ],
  };
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    logo: absoluteUrl("/logo-400.png"),
    slogan: "Специалист по натуральному латексу. Компания основана в 2009 году",
    description:
      "Про-Латекс производит матрасы, подушки и топперы из 100% натурального бельгийского латекса.",
    foundingDate: SITE_FOUNDED,
    telephone: "+7-804-700-77-50",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+7-804-700-77-50",
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS.streetAddress,
      addressLocality: SITE_ADDRESS.addressLocality,
      addressCountry: SITE_ADDRESS.addressCountry,
    },
    areaServed: "RU",
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function itemListJsonLd(
  items: { name: string; url: string }[],
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    inLanguage: "ru-RU",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-400.png"),
      },
    },
  };
}

export function productJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  material?: string;
  sku?: string;
  category?: string;
  /** Спецификации товара -> additionalProperty (PropertyValue). */
  specs?: { name: string; value: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    image: opts.image ? absoluteUrl(opts.image) : absoluteUrl("/logo-400.png"),
    ...(opts.sku ? { sku: opts.sku } : {}),
    brand: {
      "@type": "Brand",
      name: SITE_NAME_EN,
    },
    material: opts.material ?? "Натуральный латекс",
    category: opts.category ?? "Матрасы",
    ...(opts.specs && opts.specs.length
      ? {
          additionalProperty: opts.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.name,
            value: s.value,
          })),
        }
      : {}),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.url),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(opts.url),
    },
    image: absoluteUrl("/opengraph-image/"),
    inLanguage: "ru-RU",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-400.png"),
      },
    },
  };
}

export function videoObjectJsonLd(opts: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.name,
    description: opts.description,
    thumbnailUrl: absoluteUrl(opts.thumbnailUrl),
    contentUrl: absoluteUrl(opts.contentUrl),
    uploadDate: opts.uploadDate,
  };
}
