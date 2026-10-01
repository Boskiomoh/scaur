import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import Button from "@/components/ui/button";
import {
  fidelity,
  fidelityUrl,
  limits,
  repoUrl,
  stack,
  targets,
  works,
} from "@/data/about";
import { kitThermalSrc } from "@/lib/thermal";

const notYet = "Pending";
const sectionHeading =
  "font-display text-sheet-title md:text-h2-phone lg:text-section";

const About: FC = () => (
  <div className="mx-auto grid max-w-page gap-y-14 px-4 pt-7 pb-16 md:gap-y-12 md:px-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-24 lg:px-12 lg:pt-14 lg:pb-28">
    <div className="flex flex-col gap-4.5 md:gap-6 lg:col-span-8">
      <h1 className="font-display text-h1-phone md:text-hero-tablet lg:text-h1">
        How this store was built
      </h1>
      <p className="max-w-axis text-blurb leading-normal text-ink-2 lg:text-xl">
        Scaur is a headless Shopify storefront for a fictional brand of mountain
        clothing, sold as a layering system. Products, prices, stock and the
        checkout come from a real Shopify development store. A portfolio project
        by Daniel Omoyibo.
      </p>
      <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
        {fidelityUrl && (
          <Button href={fidelityUrl} size="lg" className="lg:h-12">
            Read the fidelity report
          </Button>
        )}
        <Button
          href={repoUrl}
          variant="secondary"
          size="lg"
          className="lg:h-12"
        >
          Source code on GitHub
        </Button>
      </div>
    </div>

    <aside className="flex flex-col gap-2 self-end bg-snow p-5 md:gap-2.5 md:p-6 lg:col-span-3 lg:col-start-10">
      <span className="text-sm font-semibold">The one-minute test</span>
      <p className="text-nav leading-lead text-ink-2">
        On a phone: build a kit, add it to the cart in one tap, and reach
        Shopify&apos;s checkout in under a minute. That is the bar this store
        was built to.
      </p>
      <Link href="/kit" className="text-nav font-semibold">
        Start with the kit builder
      </Link>
    </aside>

    <section
      aria-labelledby="works-heading"
      className="flex flex-col gap-3 md:gap-4 lg:col-span-7"
    >
      <h2 id="works-heading" className={sectionHeading}>
        What actually works
      </h2>
      <p className="mb-1.5 max-w-axis text-base leading-lead text-ink-2 md:mb-2 md:text-blurb">
        The hard parts of a store, done against a real Shopify backend rather
        than mock data.
      </p>
      <ul className="border-b border-line">
        {works.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="group flex flex-col gap-1 border-t border-line py-3.5 no-underline md:grid md:py-4 md:grid-cols-works md:items-baseline md:gap-x-6"
            >
              <span className="flex flex-col gap-1">
                <span className="text-blurb font-semibold group-hover:underline">
                  {item.title}
                </span>
                <span className="text-nav leading-normal text-ink-2">
                  {item.body}
                </span>
              </span>
              <span className="text-caption whitespace-nowrap text-ink-2 max-md:order-first md:text-sm">
                {item.where}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>

    <section
      aria-labelledby="ideas-heading"
      className="flex flex-col gap-6 md:gap-7 lg:col-span-4 lg:col-start-9"
    >
      <h2 id="ideas-heading" className={sectionHeading}>
        Two ideas of its own
      </h2>
      {[
        {
          src: "/thermal/shell-green-splash.webp",
          alt: "Illustrative thermal view of a hiker in the Scarp Shell",
          title: "Thermal view",
          body: "Any product photo flips into an illustrative thermal image, and every piece is rated on one temperature scale from -10 to 80°F, so you see what a layer is for.",
          position: "object-featured",
        },
        {
          src: kitThermalSrc(4),
          alt: "Illustrative thermal view of a hiker wearing a full kit",
          title: "Kit builder",
          body: "Pick the activity, temperature, rain and wind. The rules choose one piece per layer, skip what isn't needed, and the whole kit goes into the cart in one action.",
          position: "object-kit-figure",
        },
      ].map((idea) => (
        <div key={idea.title} className="flex flex-col gap-2.5 md:gap-3">
          <div className="relative h-55 bg-heat-0 md:h-60">
            <Image
              src={idea.src}
              alt={idea.alt}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className={`object-cover ${idea.position}`}
            />
          </div>
          <span className="text-lg font-semibold">{idea.title}</span>
          <span className="text-nav leading-lead text-ink-2">{idea.body}</span>
        </div>
      ))}
    </section>

    <section
      aria-labelledby="stack-heading"
      className="flex flex-col gap-3 md:gap-4 lg:col-span-6"
    >
      <h2 id="stack-heading" className={sectionHeading}>
        The stack
      </h2>
      <dl className="border-b border-line">
        {stack.map((item) => (
          <div
            key={item.name}
            className="flex flex-col gap-1 border-t border-line py-3 text-nav leading-normal md:grid md:grid-cols-stack md:gap-x-6 md:py-3.5 md:text-base md:leading-lead"
          >
            <dt className="font-semibold">{item.name}</dt>
            <dd className="text-ink-2">{item.body}</dd>
          </div>
        ))}
      </dl>
    </section>

    <section
      aria-labelledby="targets-heading"
      className="flex flex-col gap-4 lg:col-span-5 lg:col-start-8"
    >
      <h2 id="targets-heading" className={sectionHeading}>
        Targets and results
      </h2>
      <table className="bg-snow text-nav">
        <thead>
          <tr className="text-sm font-semibold">
            <th scope="col" className="px-4 py-2.75 text-start">
              Lighthouse, mobile
            </th>
            <th scope="col" className="px-4 py-2.75 text-end">
              Target
            </th>
            <th scope="col" className="px-4 py-2.75 text-end">
              Measured
            </th>
          </tr>
        </thead>
        <tbody>
          {targets.map((item) => (
            <tr key={item.name} className="border-t border-mist">
              <th scope="row" className="px-4 py-2.75 text-start font-normal">
                {item.name}
              </th>
              <td className="px-4 py-2.75 text-end font-data text-caption">
                {item.target}
              </td>
              <td className="px-4 py-2.75 text-end font-data text-caption text-ink-2">
                {item.result ?? notYet}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className="text-caption text-ink-2">
        Targets come from the project brief. Layout shift and JavaScript were
        measured on the production build on 1 Oct 2026; Lighthouse scores are
        filled in from the live site. The framework alone is over the JavaScript
        target.
      </span>
    </section>

    <section
      aria-labelledby="design-heading"
      className="flex flex-col gap-4 lg:col-span-6"
    >
      <h2 id="design-heading" className={sectionHeading}>
        Design to code
      </h2>
      <p className="text-blurb leading-relaxed text-ink-2">
        Every page was designed first, at 1440, 768 and 390 pixels wide, along
        with search, the cart, the menu and every empty, loading and error
        state. The build is screenshotted at the same widths and compared with
        the design pixel by pixel; the report shows each page side by side with
        the differences marked.
      </p>
    </section>

    <section
      aria-label="Fidelity results"
      className="flex flex-col gap-3 lg:col-span-5 lg:col-start-8"
    >
      <table className="bg-snow text-nav">
        <caption className="sr-only">Design match by page and width</caption>
        <thead>
          <tr className="text-sm font-semibold">
            <th scope="col" className="px-3 py-2.75 text-start md:px-4">
              Design match
            </th>
            {["1440", "768", "390"].map((width) => (
              <th
                key={width}
                scope="col"
                className="px-3 py-2.75 text-end font-data text-xs md:px-4"
              >
                {width}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fidelity.map((page) => (
            <tr key={page.name} className="border-t border-mist">
              <th scope="row" className="px-3 py-2.5 text-start font-normal md:px-4">
                {page.name}
              </th>
              {[page.desktop, page.tablet, page.phone].map((value, index) => (
                <td
                  key={index}
                  className="px-3 py-2.5 text-end font-data text-caption text-ink-2 md:px-4"
                >
                  {value ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <span className="text-caption text-ink-2">
        1px-tolerant pixel match, measured on 1 Oct 2026 against the production
        build. The report shows where the rest differs.
      </span>
    </section>

    <section
      aria-labelledby="limits-heading"
      className="flex flex-col gap-3.5 border-t border-line pt-12 md:gap-5 lg:col-span-12 lg:grid lg:grid-cols-12 lg:gap-x-6"
    >
      <h2 id="limits-heading" className={`${sectionHeading} lg:col-span-4`}>
        What it doesn&apos;t do
      </h2>
      <ul className="grid gap-3 text-nav leading-lead text-ink-2 md:grid-cols-2 md:gap-3.5 md:text-base md:gap-x-6 lg:col-span-7 lg:col-start-6">
        {limits.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  </div>
);

export default About;
