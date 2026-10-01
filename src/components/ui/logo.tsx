import Link from "next/link";
import type { FC } from "react";

import { cn } from "@/lib/cn";

interface LogoProps {
  size?: "responsive" | "md";
  isLink?: boolean;
  onClick?: () => void;
}

const sizes = {
  responsive: {
    mark: "size-6.5 md:size-7",
    word: "text-wordmark-sm md:text-wordmark",
    gap: "gap-2 md:gap-2.5",
  },
  md: { mark: "size-7", word: "text-wordmark", gap: "gap-2.5" },
};

const Logo: FC<LogoProps> = ({
  size = "responsive",
  isLink = true,
  onClick,
}) => {
  const content = (
    <>
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className={cn("shrink-0", sizes[size].mark)}
      >
        <path d="M8 23L36 9L92 9L92 20L36 20L8 34Z" className="fill-ink" />
        <path d="M8 46L48 26L92 26L92 37L48 37L8 57Z" className="fill-ink" />
        <path
          d="M8 63L20 63L60 43L92 43L92 54L60 54L20 74L8 74Z"
          className="fill-ink"
        />
        <path
          d="M8 80L32 80L72 60L92 60L92 71L72 71L32 91L8 91Z"
          className="fill-ember"
        />
      </svg>
      <span className={cn("font-display tracking-wordmark", sizes[size].word)}>
        Scaur
      </span>
    </>
  );

  if (!isLink)
    return (
      <div className={cn("flex items-center", sizes[size].gap)}>{content}</div>
    );

  return (
    <Link
      href="/"
      aria-label="Scaur home"
      onClick={onClick}
      className={cn("flex items-center no-underline", sizes[size].gap)}
    >
      {content}
    </Link>
  );
};

export default Logo;
