export function Filo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-brass/60 to-brass" />
      <span className="h-[3px] w-[3px] rotate-45 bg-brass" />
    </div>
  );
}
