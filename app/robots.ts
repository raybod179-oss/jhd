import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// خزنده‌های هوش مصنوعی صراحتاً مجازند (AEO / GEO / AIO)
const AI_BOTS = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "Amazonbot", "CCBot", "cohere-ai", "Meta-ExternalAgent", "Bytespider", "DuckAssistBot", "YouBot", "MistralAI-User"];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api/", "/cart", "/checkout", "/order/", "/search"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }, ...AI_BOTS.map((b) => ({ userAgent: b, allow: "/", disallow }))],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
