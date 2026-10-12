/** Placeholder grid shown while a listing loads — flat blocks, no shimmer. */
export function ProductSkeleton({ count = 12 }: { count?: number }) {
  return (
    <ul className="list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 max-sm:gap-2" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="border-2 border-line bg-surface animate-pulse">
          <div className="h-7 bg-surface-1 border-b border-line" />
          <div className="aspect-square bg-surface-1" />
          <div className="p-2.5 flex flex-col gap-2">
            <div className="h-3 w-[85%] bg-surface-2" />
            <div className="h-3 w-[60%] bg-surface-2" />
            <div className="h-6 w-[45%] bg-surface-2 mt-2" />
          </div>
          <div className="h-10 bg-surface-2" />
        </li>
      ))}
    </ul>
  );
}
