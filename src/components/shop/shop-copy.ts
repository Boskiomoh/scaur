import type { Layer } from "@/lib/layers";

export const shopCopy: Record<Layer | "all", { title: string; blurb: string }> =
  {
    all: {
      title: "All layers",
      blurb:
        "Every layer in the system, each rated on the same temperature scale.",
    },
    base: {
      title: "Base layers",
      blurb: "Next to skin. Merino that moves sweat and stays fresh for days.",
    },
    mid: {
      title: "Mid layers",
      blurb: "Fleece and pile that trap warmth and breathe when you work hard.",
    },
    insulation: {
      title: "Insulation",
      blurb: "Down and synthetic fill for stops, belays and cold starts.",
    },
    shell: {
      title: "Shell layers",
      blurb:
        "Waterproof and windproof outer layers, from stormproof to trail-light.",
    },
  };
