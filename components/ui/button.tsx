import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Square button that renders only its child icon. Provide an `aria-label`. */
  iconOnly?: boolean;
  loading?: boolean;
  /** Turns the button into a toggle: sets `aria-pressed` and shows the "on" style. */
  pressed?: boolean;
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
    iconLeft,
    iconRight,
    iconOnly = false,
    loading = false,
    pressed,
    className,
    children,
    ...rest
  } = props;

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
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
      aria-pressed={pressed}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
