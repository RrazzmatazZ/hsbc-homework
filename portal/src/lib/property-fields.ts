export type PropertyFieldName =
  | "squareFootage"
  | "bedrooms"
  | "bathrooms"
  | "yearBuilt"
  | "lotSize"
  | "distanceToCityCenter"
  | "schoolRating";

export type PropertyFeatures = Record<PropertyFieldName, number>;

export type PropertyFieldDefinition = {
  name: PropertyFieldName;
  label: string;
  placeholder: string;
  min?: number;
  max?: number;
  step: number;
};

export const PROPERTY_FIELDS: readonly PropertyFieldDefinition[] = [
  {
    name: "squareFootage",
    label: "Square footage",
    placeholder: "Property floor area",
    min: 1,
    step: 1,
  },
  {
    name: "bedrooms",
    label: "Bedrooms",
    placeholder: "Number of bedrooms",
    min: 0,
    step: 1,
  },
  {
    name: "bathrooms",
    label: "Bathrooms",
    placeholder: "Number of bathrooms",
    min: 0,
    step: 0.5,
  },
  {
    name: "yearBuilt",
    label: "Year built",
    placeholder: "Construction year",
    min: 1800,
    max: new Date().getFullYear(),
    step: 1,
  },
  {
    name: "lotSize",
    label: "Lot size",
    placeholder: "Total lot area",
    min: 1,
    step: 1,
  },
  {
    name: "distanceToCityCenter",
    label: "Distance to city center",
    placeholder: "Distance to city center",
    min: 0,
    step: 0.1,
  },
  {
    name: "schoolRating",
    label: "School rating",
    placeholder: "Rating from 0 to 10",
    min: 0,
    max: 10,
    step: 0.1,
  },
];
