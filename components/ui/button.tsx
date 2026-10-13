import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `pill` is fully rounded, `rounded` is a squircle — matches the header icon buttons. */
  shape?: "pill" | "rounded";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Square button that renders only its child icon. Provide an `aria-label`. */
  iconOnly?: boolean;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined };

type LinkButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps | "href"> & { href: string };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    shape = "pill",
    iconLeft,
    iconRight,
    iconOnly = false,
    loading = false,
    className,
    children,
    ...rest
  } = props;

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    shape === "rounded" && "btn-rounded",
    iconOnly && "btn-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <span className="btn-spinner" aria-hidden /> : iconLeft}
      {children}
      {!loading && iconRight}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest as Omit<LinkButtonProps, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonProps } = rest as Omit<NativeButtonProps, keyof CommonProps>;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
