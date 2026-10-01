export const layers = [
  { id: "base", label: "Base" },
  { id: "mid", label: "Mid" },
  { id: "insulation", label: "Insulation" },
  { id: "shell", label: "Shell" },
] as const;

export type Layer = (typeof layers)[number]["id"];
