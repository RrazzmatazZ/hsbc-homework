import { SegmentChart, type SegmentBucket } from "./segment-chart";

const formatPrice = (value: number) => `$${Math.round(value / 1000)}k`;

export function PriceDistribution({ buckets }: { buckets: SegmentBucket[] }) {
  return <SegmentChart title="Price distribution" buckets={buckets} formatValue={formatPrice} />;
}
