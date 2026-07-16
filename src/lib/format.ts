export function formatAcres(acres: number): string {
  return `${acres.toFixed(2)} acres`;
}

export function acresToSqm(acres: number): number {
  return acres * 4046.8564224;
}

export function formatAreaBoth(acres: number): string {
  const sqm = acresToSqm(acres);
  return `${acres.toFixed(2)} acres (${Math.round(sqm).toLocaleString("en-IN")} sq.m)`;
}

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatGlv(perSqft: number | null): string {
  if (perSqft === null) return "Not applicable";
  return `${formatCurrency(perSqft)} / sq.ft`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
