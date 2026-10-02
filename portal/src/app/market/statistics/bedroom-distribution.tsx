import { SegmentChart, type SegmentBucket } from "./segment-chart";

const formatBedrooms = (value: number) => value.toFixed(1).replace(".0", "");

export function BedroomDistribution({ buckets }: { buckets: SegmentBucket[] }) {
  return <SegmentChart title="Bedroom distribution" buckets={buckets} formatValue={formatBedrooms} />;
}
