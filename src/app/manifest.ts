import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Scaur",
    short_name: "Scaur",
    description:
      "Technical layers, rated on one scale. A portfolio demo store.",
    start_url: "/",
    display: "browser",
    background_color: "#eef1f3",
    theme_color: "#111418",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
