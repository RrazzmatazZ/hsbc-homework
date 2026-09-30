import { PropertyTable } from "./property-table";

const metrics = ["Properties", "Average price", "Median price", "Price per sq ft"];
const charts = [
  ["Price distribution", "Understand how property prices are spread across the dataset."],
  ["Area vs price", "Explore the relationship between square footage and value."],
  ["Price by bedrooms", "Compare average prices across property segments."],
  ["School rating impact", "Analyse how school ratings relate to market value."],
] as const;

export default function MarketPage() {
  return (
    <div className="page-shell">
      <main className="page-container">
        <section className="card p-4" aria-labelledby="filters-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="filters-heading" className="section-title">Market filters</h2>
              <p className="supporting-text">Filter controls will be connected to the analysis API.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Price", "Area", "Bedrooms", "Year built", "School rating"].map((filter) => (
                <span key={filter} className="border border-slate-200 px-3 py-1.5 text-xs text-slate-500">{filter}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Market summary">
          {metrics.map((metric) => (
            <article key={metric} className="card p-4">
              <p className="text-sm font-medium text-slate-500">{metric}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">—</p>
            </article>
          ))}
        </section>

        <PropertyTable />


        <details open className="group collapsible-card">
          <summary className="collapsible-card-summary">
            <div>
              <h2 className="section-title">Market statistics</h2>
            </div>
            <span className="text-sm text-slate-500 group-open:hidden">Show</span>
            <span className="hidden text-sm text-slate-500 group-open:inline">Hide</span>
          </summary>

          <section className="grid gap-4 border-t border-slate-200 p-4 lg:grid-cols-2" aria-label="Market visualisations">
            {charts.map(([title]) => (
              <article key={title} className="min-h-64 border border-slate-200 p-5">
                <h3 className="item-title">{title}</h3>
                <div className="mt-6 flex h-32 items-end gap-3 border border-dashed border-slate-200 bg-slate-50 px-6 pb-4 pt-7" aria-hidden="true">

                </div>
              </article>
            ))}
          </section>
        </details>

      </main>
    </div>
  );
}
