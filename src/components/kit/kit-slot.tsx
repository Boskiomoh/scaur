import { ArrowsLeftRightIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import type { FC, MouseEvent } from "react";

import { emptyReason } from "@/components/kit/kit-copy";
import { formatMoney } from "@/lib/format";
import type { KitSlot as KitSlotData } from "@/lib/kit";
import { layers } from "@/lib/layers";
import type { Product } from "@/types/product";

interface KitSlotProps {
  slot: KitSlotData;
  list: Product[];
  temp: number;
  size: string;
  swapHref: string;
  removeHref: string;
  addHref: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const iconLink =
  "flex size-9 items-center justify-center rounded-full border-control border-line bg-snow no-underline";
const emptyBox =
  "flex aspect-4/5 w-full flex-col items-center justify-center gap-2.5 border-control border-dashed border-empty-line p-3 text-center text-caption text-ink-2 lg:gap-3 lg:p-4 lg:text-sm";

const KitSlot: FC<KitSlotProps> = (props) => {
  const { slot, list, temp, size, swapHref, removeHref, addHref, onNavigate } =
    props;
  const label = layers.find((layer) => layer.id === slot.layer)!.label;
  const image =
    slot.status === "filled"
      ? slot.product.colours.find(
          (colour) => colour.name === slot.variant.colour,
        )?.image
      : undefined;

  return (
    <li className="flex min-w-0 flex-col gap-2 lg:gap-2.5">
      <span className="font-data text-2xs text-ink-2 lg:text-xs">{label}</span>

      {slot.status === "filled" && (
        <>
          <div className="relative aspect-4/5 bg-mist">
            {image && (
              <Image
                src={image.url}
                alt={slot.product.title}
                fill
                sizes="(min-width: 1024px) 180px, 50vw"
                className="object-cover object-tile"
              />
            )}
          </div>
          <span className="min-h-9 text-sm leading-snug font-semibold lg:min-h-10 lg:text-nav">
            {slot.product.title}
          </span>
          {slot.isSubstitute && (
            <span role="status" className="text-caption text-ink-2">
              {list[slot.index].title} is sold out in {size}, so the next
              warmest piece is in its place.
            </span>
          )}
          <div className="flex items-center justify-between">
            <span className="font-data text-caption">
              {formatMoney(slot.variant.price)}
            </span>
            <div className="flex gap-1.5">
              <Link
                href={swapHref}
                scroll={false}
                aria-label={`Swap ${label.toLowerCase()} layer, currently ${slot.product.title}`}
                onClick={(event) => onNavigate(event, swapHref)}
                className={iconLink}
              >
                <ArrowsLeftRightIcon aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href={removeHref}
                scroll={false}
                aria-label={`Remove ${slot.product.title} from kit`}
                onClick={(event) => onNavigate(event, removeHref)}
                className={iconLink}
              >
                <XIcon aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </>
      )}

      {slot.status === "empty" && (
        <div className={emptyBox}>
          <span>
            {slot.reason === "removed"
              ? "Removed from this kit"
              : emptyReason(slot.layer, temp)}
          </span>
          <Link
            href={addHref}
            scroll={false}
            onClick={(event) => onNavigate(event, addHref)}
            className="flex h-9 items-center rounded-full border-control border-ink px-4 font-semibold text-ink no-underline"
          >
            Add one anyway
          </Link>
        </div>
      )}

      {slot.status === "sold-out" && (
        <div className={emptyBox}>
          <span className="font-data text-caption text-ink">
            Sold out in {size}
          </span>
          <span>
            Every {label.toLowerCase()} piece for this day is sold out in your
            size.
          </span>
          <a
            href="#kit-size"
            className="flex h-9 items-center rounded-full border-control border-ink px-4 font-semibold text-ink no-underline"
          >
            Change size
          </a>
        </div>
      )}
    </li>
  );
};

export default KitSlot;
