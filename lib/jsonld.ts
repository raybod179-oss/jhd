import { SITE } from "./site";

export const abs = (path: string) => SITE.url + path;

export const orgLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": abs("/#org"),
  name: SITE.name,
  alternateName: SITE.nameEn,
  url: SITE.url,
  logo: abs("/icon.svg"),
  description: SITE.description,
  sameAs: [SITE.telegram, SITE.instagram].filter(Boolean),
});

export const siteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#site"),
  url: SITE.url,
  name: SITE.name,
  inLanguage: "fa-IR",
  publisher: { "@id": abs("/#org") },
  potentialAction: { "@type": "SearchAction", target: `${SITE.url}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});
