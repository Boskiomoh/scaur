export const heatStops = [
  { at: 0, hex: "#140c2e" },
  { at: 0.22, hex: "#4a1a78" },
  { at: 0.45, hex: "#a3206f" },
  { at: 0.66, hex: "#e0452b" },
  { at: 0.84, hex: "#f79a2e" },
  { at: 1, hex: "#ffe08a" },
] as const;

export const axis = { min: -10, max: 80 } as const;

const toRgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export const axisPosition = (temp: number) =>
  Math.min(1, Math.max(0, (temp - axis.min) / (axis.max - axis.min)));

export const heat = (temp: number) => {
  const x = axisPosition(temp);
  const end = heatStops.findIndex((stop) => stop.at >= x);
  if (end <= 0) return heatStops[0].hex;
  const start = heatStops[end - 1];
  const t = (x - start.at) / (heatStops[end].at - start.at);
  const from = toRgb(start.hex);
  const to = toRgb(heatStops[end].hex);
  const rgb = from.map((value, i) => Math.round(value + (to[i] - value) * t));
  return `rgb(${rgb.join(" ")})`;
};
