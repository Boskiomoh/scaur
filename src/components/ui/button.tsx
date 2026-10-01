import Link from "next/link";
import type { ComponentProps, FC } from "react";

import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-ember text-white hover:bg-ember-hover",
  secondary: "border-control border-ink text-ink hover:bg-ink hover:text-snow",
};

const sizes = {
  sm: "h-10 px-4 text-nav",
  md: "h-12 px-6 text-base",
  lg: "h-13 px-6 text-base",
};

interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

type ButtonProps = ButtonStyleProps &
  (
    | ({ href: string } & Omit<ComponentProps<typeof Link>, "className">)
    | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
  );

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const classes = cn(
    "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold whitespace-nowrap no-underline transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if (props.href !== undefined) return <Link {...props} className={classes} />;

  return <button type="button" {...props} className={classes} />;
};

export default Button;
