export function msBetween(a: Date, b: Date) { return Math.max(0, b.getTime() - a.getTime()); }
export function hoursBetween(a: Date, b: Date) { return msBetween(a,b) / 36e5; }
export function daysBetween(a: Date, b: Date) { return Math.ceil(msBetween(a,b) / 864e5); }

export function calcTotalCents({
  unit, basePriceCents, start, end,
}: { unit: "hour"|"day"; basePriceCents: number; start: Date; end: Date }) {
  if (unit === "hour") {
    const h = Math.max(1, Math.round(hoursBetween(start, end)));
    return h * basePriceCents;
  }
  const d = Math.max(1, daysBetween(start, end));
  return d * basePriceCents;
}
