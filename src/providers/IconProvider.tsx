"use client";

import { IconContext } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** Storefront icons are drawn in Phosphor's "bold" weight throughout. */
export function IconProvider({ children }: { children: ReactNode }) {
  return (
    <IconContext.Provider value={{ weight: "bold" }}>
      {children}
    </IconContext.Provider>
  );
}
