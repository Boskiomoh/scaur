import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import Button from "@/components/ui/button";
import type { Image as ProductImage } from "@/types/product";

interface NotFoundProps {
  image: ProductImage | null;
}

const NotFound: FC<NotFoundProps> = ({ image }) => (
  <div className="mx-auto flex max-w-page flex-col gap-10 px-4 pt-10 pb-16 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:pt-14 lg:pb-18">
    <div className="flex flex-col justify-center gap-7 lg:col-span-6 lg:pe-6">
      <h1 className="font-display text-h1-phone md:text-hero-tablet lg:text-h1">
        That trail doesn&apos;t go anywhere.
      </h1>
      <p className="max-w-lost text-blurb leading-normal text-ink-2 lg:text-lead">
        The page you followed isn&apos;t here. It may have moved, or the link
        has a typo. Head back to the layers, or let the kit builder pick a route
        for the day.
      </p>
      <div className="flex flex-col gap-3 md:flex-row">
        <Button href="/shop" size="lg" className="lg:h-12">
          Shop layers
        </Button>
        <Button href="/kit" variant="secondary" size="lg" className="lg:h-12">
          Build your kit
        </Button>
      </div>
      <Link
        href="/search"
        className="inline-flex items-center gap-2 self-start text-nav font-semibold"
      >
        <MagnifyingGlassIcon aria-hidden="true" className="size-4.5" />
        Or search the store
      </Link>
    </div>
    {image && (
      <div className="relative h-110 lg:col-span-5 lg:col-start-8 lg:h-160 lg:self-center">
        <Image
          src={image.url}
          alt="A hiker in a hooded shell, seen from behind, looking out into mist and rain"
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover object-featured"
        />
      </div>
    )}
  </div>
);

export default NotFound;
