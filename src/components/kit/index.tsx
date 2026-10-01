"use client";

import { useState, type FC, type MouseEvent } from "react";

import { kitLabel } from "@/components/kit/kit-copy";
import KitFigure from "@/components/kit/kit-figure";
import KitFooter from "@/components/kit/kit-footer";
import KitForm from "@/components/kit/kit-form";
import KitReadout from "@/components/kit/kit-readout";
import KitSlot from "@/components/kit/kit-slot";
import { buildKit, layerLists, type KitInput } from "@/lib/kit";
import type { Layer } from "@/lib/layers";
import { kitHref, parseKitParams } from "@/lib/url";
import type { Product } from "@/types/product";

interface KitProps {
  initialInput: KitInput;
  products: Product[];
}

const Kit: FC<KitProps> = ({ initialInput, products }) => {
  // State
  const [input, setInput] = useState(initialInput);

  // Derived
  const kit = buildKit(input, products);
  const lists = layerLists(products);
  const href = kitHref(input);
  const swap = (layer: Layer, index: number) =>
    kitHref({
      ...input,
      pick: { ...input.pick, [layer]: (index + 1) % lists[layer].length },
    });
  const toggle = (layer: Layer, isOn: boolean) =>
    kitHref({
      ...input,
      off: { ...input.off, [layer]: !isOn },
      on: { ...input.on, [layer]: isOn },
    });

  // Handlers
  // replaceState keeps the kit shareable without a server round trip on every change.
  const update = (next: KitInput) => {
    setInput(next);
    window.history.replaceState(null, "", kitHref(next));
  };

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    event.preventDefault();
    update(
      parseKitParams(
        Object.fromEntries(
          new URL(target, window.location.origin).searchParams,
        ),
      ),
    );
  };

  return (
    <div className="mx-auto grid max-w-page lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:pt-10 lg:pb-16">
      <div className="px-4 pt-7 pb-10 md:px-8 lg:col-span-4 lg:p-0">
        <KitForm
          input={input}
          onChange={(patch) => update({ ...input, ...patch })}
        />
      </div>

      <section
        aria-label="Your kit"
        className="flex flex-col gap-6 bg-snow px-4 pt-8 md:px-8 lg:col-span-7 lg:col-start-6 lg:bg-transparent lg:p-0"
      >
        <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-3">
            <KitFigure level={kit.level} pieces={kit.pieces} />
          </div>
          <div className="md:order-first lg:order-none lg:col-span-4">
            <KitReadout kit={kit} temp={input.temp} />
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 lg:gap-4">
          {kit.slots.map((slot) => (
            <KitSlot
              key={slot.layer}
              slot={slot}
              list={lists[slot.layer]}
              temp={input.temp}
              size={input.size}
              swapHref={swap(slot.layer, "index" in slot ? slot.index : 0)}
              removeHref={toggle(slot.layer, false)}
              addHref={toggle(slot.layer, true)}
              onNavigate={handleNavigate}
            />
          ))}
        </ul>

        <KitFooter
          kit={kit}
          size={input.size}
          label={kitLabel(input)}
          href={href}
        />
      </section>
    </div>
  );
};

export default Kit;
