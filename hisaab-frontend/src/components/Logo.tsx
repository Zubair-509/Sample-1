// Brand mark — Hisaab_Design_Document.md §2.3
// The Urdu "ح" (ha) doubles as wordmark icon: white on forest-green rounded square.
export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-900 font-urdu text-lg leading-none text-white"
        aria-hidden="true"
      >
        ح
      </span>
      {withWordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-primary-900">Hisaab</span>
      )}
    </div>
  );
}
