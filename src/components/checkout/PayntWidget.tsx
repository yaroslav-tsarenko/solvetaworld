"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { Lock, CreditCard } from "@phosphor-icons/react";

interface PayntWidgetProps {
  checkoutId: string;
  scriptUrl: string;
  shopperResultUrl: string;
  integrity?: string;
  locale?: string;
  brands?: string;
  onReady?: () => void;
}

export function PayntWidget({
  checkoutId,
  scriptUrl,
  shopperResultUrl,
  integrity,
  locale = "en",
  brands = "VISA MASTER AMEX",
  onReady,
}: PayntWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptUrl || !checkoutId) return;

    // 1. Configure global wpwlOptions before script execution
    (window as any).wpwlOptions = {
      locale: locale.slice(0, 2),
      style: "plain",
      brandDetection: true,
      showCVVHint: true,
      labels: {
        cvv: "CVC / CVV",
        cardHolder: "Cardholder Name",
      },
      onReady: () => {
        setIsLoaded(true);
        onReady?.();
      },
      onError: (error: any) => {
        console.error("PayNT widget runtime error:", error);
      },
    };

    // 2. Dynamically inject the paymentWidgets script
    const script = document.createElement("script");
    script.id = `paynt-widget-script-${checkoutId}`;
    script.src = scriptUrl;
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = "anonymous";
    }
    script.async = true;

    document.body.appendChild(script);

    // 3. Cleanup on unmount (avoids duplicate fields when navigating back/forth)
    return () => {
      // Remove injected script
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      // Remove dynamically generated widget DOM elements
      const injectedContainers = document.querySelectorAll(".wpwl-container");
      injectedContainers.forEach((el) => el.remove());

      const injectedForms = document.querySelectorAll("form.wpwl-form");
      injectedForms.forEach((el) => el.remove());

      // Clean up window configuration
      delete (window as any).wpwlOptions;
    };
  }, [checkoutId, scriptUrl, integrity, locale, onReady]);

  return (
    <div ref={containerRef} className="paynt-widget-wrapper w-full">
      {/* Security badge */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-line text-xs font-mono text-ink-muted">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-ink">
          <CreditCard size={16} className="text-hivis" />
          Card Details
        </span>
        <span className="flex items-center gap-1 text-[11px] text-ink-subtle">
          <Lock size={12} />
          PCI-DSS SAQ-A 256-bit
        </span>
      </div>

      {/* Loading placeholder */}
      {!isLoaded && (
        <div
          className="flex flex-col items-center justify-center p-8 bg-surface-1 border-2 border-line-strong text-center gap-3 animate-pulse"
          role="status"
          aria-live="polite"
        >
          <LoadingSpinner />
          <span className="text-sm font-semibold text-ink">Loading secure payment form...</span>
          <span className="text-xs text-ink-muted">Connecting with SetoPay / PayNT</span>
        </div>
      )}

      {/* OPPWA widget target form */}
      <div className={isLoaded ? "block" : "hidden"}>
        <form
          action={shopperResultUrl}
          className="paymentWidgets"
          data-brands={brands}
        />
      </div>
    </div>
  );
}
