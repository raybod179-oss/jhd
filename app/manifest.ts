import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} | فروشگاه آزمایشی`, short_name: SITE.name, description: SITE.description,
    start_url: "/", display: "standalone", dir: "rtl", lang: "fa", background_color: "#ffffff", theme_color: SITE.brand,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
