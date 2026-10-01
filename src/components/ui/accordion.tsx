import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import type { FC, ReactNode } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
}

const Accordion: FC<AccordionProps> = ({ title, children, isOpen }) => (
  <details open={isOpen} className="group border-t border-line">
    <summary className="flex min-h-14 list-none items-center justify-between font-semibold">
      {title}
      <CaretDownIcon
        aria-hidden="true"
        className="size-4.5 group-open:rotate-180"
      />
    </summary>
    <div className="pb-5 text-nav leading-relaxed text-ink-2">{children}</div>
  </details>
);

export default Accordion;
