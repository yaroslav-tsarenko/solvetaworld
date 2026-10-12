"use client";

import { Minus, Plus } from "@phosphor-icons/react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
  size?: "sm" | "md";
}

/** Square stepper: [−][ qty ][+] inside one 2px frame. */
export function QuantitySelector({ quantity, maxQuantity, onChange, size = "md" }: QuantitySelectorProps) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-11";
  const btn = `${w} ${h} flex items-center justify-center bg-surface text-ink border-0 cursor-pointer hover:bg-hivis hover:text-coal disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-ink`;
  return (
    <div className="inline-flex items-stretch border-2 border-line-strong" role="group" aria-label="Quantity">
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <output
        className={`${h} min-w-12 px-2 flex items-center justify-center border-x-2 border-line-strong font-display font-extrabold text-lg tabular-nums`}
        aria-live="polite"
      >
        {quantity}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
