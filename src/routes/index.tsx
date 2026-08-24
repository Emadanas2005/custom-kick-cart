import { createFileRoute, redirect } from "@tanstack/react-router";

// The app is a standalone vanilla HTML/CSS/JS sneaker store served from
// /store. "/" simply forwards to its landing page.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SoleVault — Premium Sneaker Store" },
      {
        name: "description",
        content:
          "Shop authentic premium sneakers at SoleVault: curated drops, running, basketball and lifestyle silhouettes with fast delivery.",
      },
      { property: "og:title", content: "SoleVault — Premium Sneaker Store" },
      {
        property: "og:description",
        content:
          "Authentic premium sneakers, curated drops and 48-hour delivery at SoleVault.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ href: "/store/index.html" });
  },
  component: () => null,
});
