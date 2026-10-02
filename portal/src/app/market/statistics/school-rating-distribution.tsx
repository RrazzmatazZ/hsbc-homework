import { SegmentChart, type SegmentBucket } from "./segment-chart";

const formatRating = (value: number) => value.toFixed(1).replace(".0", "");

export function SchoolRatingDistribution({ buckets }: { buckets: SegmentBucket[] }) {
  return <SegmentChart title="School rating distribution" buckets={buckets} formatValue={formatRating} />;
}
