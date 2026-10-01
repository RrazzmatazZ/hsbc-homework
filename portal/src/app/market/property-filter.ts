export type PropertyRange = {
  from?: number;
  to?: number;
};

export type PropertyFilter = {
  price?: PropertyRange;
  squareFootage?: PropertyRange;
  bedrooms?: PropertyRange;
  yearBuilt?: PropertyRange;
  schoolRating?: PropertyRange;
};

export type PropertyFilterField = keyof PropertyFilter;

export const MARKET_FILTER_FIELDS: ReadonlyArray<{
  field: PropertyFilterField;
  label: string;
  min?: number;
  max?: number;
  step: number;
}> = [
  { field: "price", label: "Price", min: 0, step: 1000 },
  { field: "squareFootage", label: "Area (sq ft)", min: 0, step: 1 },
  { field: "bedrooms", label: "Bedrooms", min: 0, step: 1 },
  { field: "yearBuilt", label: "Year built", min: 0, step: 1 },
  { field: "schoolRating", label: "School rating", min: 0, max: 10, step: 0.1 },
];
