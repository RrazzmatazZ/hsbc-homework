
//field name and its description
const fields = [
  ["Square footage", "Property floor area"],
  ["Bedrooms", "Number of bedrooms"],
  ["Bathrooms", "Number of bathrooms"],
  ["Year built", "Construction year"],
  ["Lot size", "Total lot area"],
  ["Distance to city", "Distance to city centre"],
  ["School rating", "Rating from 0 to 10"],
] as const;

export default function EstimatorPage() {
  return (
    <div className="page-shell">
      <main className="page-container">

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <section className="card p-5 sm:p-6" aria-labelledby="property-details-heading">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="section-title">Property details</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {fields.map(([label, description], index) => (
                <div key={label} className={`border border-slate-200 p-3 ${index === fields.length - 1 ? "sm:col-span-2" : ""}`}>
                  <p className="item-title">{label}</p>
                  <input className="form-control mt-1" placeholder={description} />
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end border-t border-slate-200 pt-5">
              <button type="button" className="rounded bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500">
                Estimate value
              </button>
            </div>
          </section>

          <aside className="card p-5 sm:p-6" aria-labelledby="estimate-result-heading">
            <h2 id="estimate-result-heading" className="section-title">Estimated property value</h2>

            <div className="mt-8 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Service Status:</span>
                <span className="font-medium text-slate-700">Not connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Result comparison</span>
                <span className="font-medium text-slate-700">Waiting for estimate</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
