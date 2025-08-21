export function toISO(ts: Date | string) {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  return d.toISOString();
}
export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}
