"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, Basket } from "@phosphor-icons/react";

interface CartToastProps {
  name: string;
  imageUrl?: string | null;
  quantity: number;
}

/** Add-to-basket notice: ink slip with a yellow tick block. */
export function CartToast({ name, imageUrl, quantity }: CartToastProps) {
  const t = useTranslations("cart");

  return (
    <motion.div
      className="flex items-stretch min-w-[280px] max-w-[360px] bg-surface text-ink border-2 border-line-strong shadow-hard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.16 }}
      role="status"
    >
      <div className="w-10 shrink-0 flex items-center justify-center bg-hivis text-coal border-r-2 border-line-strong">
        <Check size={18} />
      </div>

      <div className="flex items-center gap-3 px-3 py-2.5 min-w-0">
        <div className="relative w-11 h-11 shrink-0 border border-line bg-white flex items-center justify-center text-ink-subtle">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill sizes="44px" className="object-contain p-0.5" />
          ) : (
            <Basket size={18} />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="u-cond text-xs font-bold text-ink-muted">{t("toastAdded")}</span>
          <span className="text-[0.8125rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]">
            {name}
          </span>
          {quantity > 1 && (
            <span className="font-mono text-[0.6875rem] text-ink-subtle">{t("toastQty", { qty: quantity })}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
