const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club";

interface FAQItem {
  q: string;
  a: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface EventContext {
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  description?: string;
  organizer?: string;
}

interface ProductTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  url: string;
}

interface ArticleContext {
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  author?: string;
  image?: string;
  url: string;
}

function scriptTag(schema: Record<string, unknown>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VibeInvite",
    url: siteUrl,
    logo: `${siteUrl}/og-image.png`,
    description:
      "Premium digital invitation platform with wax-sealed envelope animations, AI copywriting, and effortless RSVP tracking.",
    email: "support@vibeinvite.bzwl.club",
    sameAs: [],
    foundingDate: "2025",
  });
}

export function WebSiteSchema() {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VibeInvite",
    url: siteUrl,
    description:
      "Create stunning, paper-like digital invitations with wax-sealed envelope animations and effortless RSVP tracking.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function FAQPageSchema({ questions }: { questions: FAQItem[] }) {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  });
}

export function ContactPointSchema({ email }: { email: string }) {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VibeInvite",
    url: siteUrl,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email,
      availableLanguage: ["English"],
    },
  });
}

export function BreadcrumbListSchema(items: BreadcrumbItem[]) {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function EventSchema({ title, startDate, endDate, location, image, description }: EventContext) {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    startDate,
    ...(endDate && { endDate }),
    ...(location && {
      location: {
        "@type": "Place",
        name: location,
      },
    }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(image && { image }),
    ...(description && { description }),
  });
}

export function ProductSchema(tiers: ProductTier[]) {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tiers.map((tier, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `VibeInvite ${tier.name}`,
        description: tier.description,
        offers: {
          "@type": "Offer",
          price: tier.price,
          priceCurrency: "USD",
          url: tier.url,
        },
        ...(tier.features.length > 0 && {
          additionalProperty: tier.features.map((f) => ({
            "@type": "PropertyValue",
            name: f,
            value: "included",
          })),
        }),
      },
    })),
  });
}

export function ArticleSchema(article: ArticleContext) {
  return scriptTag({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    ...(article.image && { image: article.image }),
    datePublished: article.publishedAt,
    ...(article.modifiedAt && { dateModified: article.modifiedAt }),
    ...(article.author && {
      author: {
        "@type": "Organization",
        name: article.author,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "VibeInvite",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  });
}

export function SchemaWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
