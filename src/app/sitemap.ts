import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs().map((doc) => ({
    url: `${site.url}${doc.href}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...docs,
  ];
}
