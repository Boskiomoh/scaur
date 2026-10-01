import Image from "next/image";
import type { FC } from "react";

import { photoCredits } from "@/data/credits";
import type { Image as ProductImage } from "@/types/product";

interface CreditsProps {
  images: Record<string, ProductImage | string>;
}

const Credits: FC<CreditsProps> = ({ images }) => (
  <div className="mx-auto flex max-w-page flex-col gap-14 px-4 pt-7 pb-16 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:pt-12 lg:pb-24">
    <div className="flex flex-col gap-4 lg:col-span-7">
      <h1 className="font-display text-collection-phone md:text-h2 lg:text-collection">
        Credits
      </h1>
      <p className="max-w-copy text-lg leading-lead text-ink-2">
        Scaur is a fictional brand, so every photo on this site comes from
        Unsplash under the Unsplash License. It allows free use without
        permission; credit is given here as thanks.
      </p>
    </div>

    <section
      aria-labelledby="photo-heading"
      className="flex flex-col gap-4 lg:col-span-12"
    >
      <h2 id="photo-heading" className="text-xl font-semibold">
        Photography
      </h2>
      <table className="w-full border-b border-line text-start">
        <thead className="max-md:sr-only">
          <tr className="text-sm font-semibold text-ink-2">
            <th scope="col" className="w-14 py-2.5">
              <span className="sr-only">Photo</span>
            </th>
            <th scope="col" className="py-2.5 ps-6 text-start">
              Used for
            </th>
            <th scope="col" className="py-2.5 ps-6 text-start">
              Photographer
            </th>
            <th scope="col" className="py-2.5 ps-6 text-start">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {photoCredits.map((credit) => {
            const image = images[credit.photo];
            const src = typeof image === "string" ? image : image?.url;
            return (
              <tr
                key={credit.photo}
                className="grid grid-cols-credits-phone items-center gap-x-4 gap-y-1 border-t border-line py-3 md:table-row"
              >
                <td className="row-span-3 md:py-3">
                  <div className="relative size-14 bg-mist">
                    {src && (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="md:py-3 md:ps-6">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-base">{credit.use}</span>
                    {credit.note && (
                      <span className="text-caption text-ink-2">
                        {credit.note}
                      </span>
                    )}
                  </span>
                </td>
                <td className="text-sm text-ink-2 md:py-3 md:ps-6 md:text-base md:text-ink">
                  {credit.who}
                </td>
                <td className="md:py-3 md:ps-6">
                  <a
                    href={`https://unsplash.com/photos/${credit.slug}`}
                    className="text-sm md:text-nav"
                  >
                    unsplash.com/photos/{credit.slug}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>

    {[
      {
        title: "Type",
        body: "Archivo and Martian Mono, both from Google Fonts under the SIL Open Font License.",
      },
      {
        title: "Icons",
        body: "Phosphor Icons, regular weight, under the MIT License.",
      },
      {
        title: "Edits",
        body: "Four photos were retouched to remove other companies' logos, because Scaur must not look like it sells their products. Thermal views are made from the photos and are illustrative, not measurements.",
      },
    ].map((section) => (
      <section
        key={section.title}
        className="flex flex-col gap-3 lg:col-span-4"
      >
        <h2 className="text-xl font-semibold">{section.title}</h2>
        <p className="text-base leading-relaxed text-ink-2">{section.body}</p>
      </section>
    ))}
  </div>
);

export default Credits;
