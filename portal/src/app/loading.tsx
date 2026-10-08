export default function Loading() {
  return (
    <main
      className="page-container w-full flex-1"
      aria-label="Loading page"
      aria-busy="true"
    >
      <div className="animate-pulse space-y-5">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-64 rounded bg-slate-200" />
          <div className="h-64 rounded bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
