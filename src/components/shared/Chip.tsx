import type { ReactNode } from "react";
import clsx from "clsx";

export function Chip({
  children,
  selected,
  disabled,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "shrink-0 whitespace-nowrap rounded-full px-4 py-2 caption-text font-medium transition-transform active:scale-95",
        disabled && "opacity-60",
        selected ? "text-white" : "text-[var(--color-ink)]"
      )}
      style={{ background: selected ? "#0066cc" : "#ffffff" }}
    >
      {children}
    </button>
  );
}
