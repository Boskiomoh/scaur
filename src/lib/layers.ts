export const layers = [
  { id: "base", label: "Base" },
  { id: "mid", label: "Mid" },
  { id: "insulation", label: "Insulation" },
  { id: "shell", label: "Shell" },
] as const;

export type Layer = (typeof layers)[number]["id"];

// The product photographed for each layer wherever a layer needs a picture.
export const layerPhotoHandles: Record<Layer, string> = {
  base: "tarn-merino-crew",
  mid: "knoll-grid-fleece",
  insulation: "cornice-down-jacket",
  shell: "scarp-shell",
};
