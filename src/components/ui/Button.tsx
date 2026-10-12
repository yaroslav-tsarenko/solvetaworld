"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft" | "light" | "flat" | "bordered";
  color?: "primary" | "danger" | "success" | "warning" | "default";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  fullWidth?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  target?: string;
  download?: boolean;
  onPress?: () => void;
  [key: string]: unknown;
}

export function Button({
  variant = "primary",
  color,
  size = "md",
  isLoading = false,
  isDisabled = false,
  isIconOnly = false,
  fullWidth = false,
  startContent,
  endContent,
  as,
  href,
  target,
  download,
  onPress,
  children,
  style,
  onClick,
  ...rest
}: ButtonProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: isIconOnly ? "0.375rem" : "0 0.875rem", minHeight: "34px", minWidth: isIconOnly ? "34px" : undefined, fontSize: "0.9375rem" },
    md: { padding: isIconOnly ? "0.5rem" : "0 1.125rem", minHeight: "42px", minWidth: isIconOnly ? "42px" : undefined, fontSize: "1rem" },
    lg: { padding: isIconOnly ? "0.625rem" : "0 1.5rem", minHeight: "50px", minWidth: isIconOnly ? "50px" : undefined, fontSize: "1.125rem" },
  };

  const resolvedVariant = resolveVariant(variant, color);

  // "Bold Utility": primary = safety yellow with ink type; secondary = ink;
  // everything square with a 2px rule.
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: "var(--color-accent)", color: "var(--color-accent-ink)", border: "2px solid var(--color-accent-ink)" },
    secondary: { background: "var(--color-text)", color: "var(--color-bg)", border: "2px solid var(--color-text)" },
    tertiary: { background: "transparent", color: "var(--color-text-secondary)", border: "2px solid transparent" },
    outline: { background: "transparent", color: "var(--color-text)", border: "2px solid var(--color-border-strong)" },
    ghost: { background: "transparent", color: "var(--color-text)", border: "2px solid transparent" },
    danger: { background: "var(--color-danger)", color: "#fff", border: "2px solid var(--color-danger)" },
    "danger-soft": { background: "transparent", color: "var(--color-danger)", border: "2px solid var(--color-danger)" },
  };

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    lineHeight: 1,
    cursor: isDisabled || isLoading ? "not-allowed" : "pointer",
    opacity: isDisabled || isLoading ? 0.5 : 1,
    transition: "background-color 0.12s, color 0.12s, transform 0.12s",
    textDecoration: "none",
    whiteSpace: "nowrap",
    width: fullWidth ? "100%" : undefined,
    ...sizeStyles[size],
    ...variantStyles[resolvedVariant],
    ...style,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || isLoading) return;
    onClick?.(e);
    onPress?.();
  };

  const content = (
    <>
      {isLoading && <span style={{ width: "1em", height: "1em", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: 0, animation: "spin 0.6s linear infinite", display: "inline-block" }} />}
      {!isLoading && startContent}
      {!isIconOnly && children}
      {endContent}
    </>
  );

  if (as || href) {
    const Component = as || "a";
    return (
      <Component href={href} target={target} download={download} style={baseStyle} onClick={handleClick} {...rest}>
        {content}
      </Component>
    );
  }

  return (
    <button type={rest.type || "button"} style={baseStyle} onClick={handleClick} disabled={isDisabled || isLoading} {...rest}>
      {content}
    </button>
  );
}

function resolveVariant(variant: string, color?: string): string {
  if (color === "primary") return "primary";
  if (color === "danger" && (variant === "flat" || variant === "light")) return "danger-soft";
  if (color === "danger") return "danger";
  if (color === "success") return "primary";
  if (variant === "light" || variant === "flat") return "ghost";
  if (variant === "bordered") return "outline";
  return variant;
}
