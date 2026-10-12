"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const dims = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-9 h-9" };

/** Square "working" indicator: a yellow block rotating inside an ink frame. */
export function LoadingSpinner({ size = "md", label }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center gap-3 p-8" role="status">
      <span className={`${dims[size]} border-[3px] border-coal bg-hivis animate-spin`} style={{ animationDuration: "1.1s" }} />
      <span className="font-display uppercase tracking-wider text-sm text-ink-muted">{label ?? "Loading"}</span>
    </div>
  );
}
