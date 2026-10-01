import type { FC } from "react";

const rows = [
  ["XS", "33-35", "27-29", "32"],
  ["S", "35-38", "29-32", "33"],
  ["M", "38-41", "32-35", "34"],
  ["L", "41-44", "35-38", "35"],
  ["XL", "44-47", "38-41", "36"],
  ["XXL", "47-50", "41-44", "37"],
];

interface SizeGuideProps {
  id: string;
}

const SizeGuide: FC<SizeGuideProps> = ({ id }) => (
  <div id={id} className="flex flex-col gap-2.5">
    <table className="w-full bg-snow text-sm" aria-describedby={`${id}-note`}>
      <caption className="sr-only">Size guide in inches</caption>
      <thead>
        <tr className="border-b border-line font-semibold">
          <th scope="col" className="px-3 py-2.5 text-start">
            Size
          </th>
          <th scope="col" className="px-3 py-2.5 text-end">
            Chest
          </th>
          <th scope="col" className="px-3 py-2.5 text-end">
            Waist
          </th>
          <th scope="col" className="px-3 py-2.5 text-end">
            Sleeve
          </th>
        </tr>
      </thead>
      <tbody className="font-data text-caption">
        {rows.map(([size, chest, waist, sleeve]) => (
          <tr key={size}>
            <th scope="row" className="px-3 py-2 text-start font-normal">
              {size}
            </th>
            <td className="px-3 py-2 text-end">{chest}</td>
            <td className="px-3 py-2 text-end">{waist}</td>
            <td className="px-3 py-2 text-end">{sleeve}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <span id={`${id}-note`} className="text-caption text-ink-2">
      Body measurements in inches. Relaxed fit: room for a mid layer and
      insulation underneath.
    </span>
  </div>
);

export default SizeGuide;
