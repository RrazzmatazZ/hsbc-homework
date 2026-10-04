import { SegmentChart, type SegmentBucket } from "./segment-chart";

const formatArea = (value: number) => Math.round(value).toLocaleString("en-US");

export function AreaDistribution({ buckets }: { buckets: SegmentBucket[] }) {
  return <SegmentChart title="Area distribution (sq ft)" buckets={buckets} formatValue={formatArea} />;
}
