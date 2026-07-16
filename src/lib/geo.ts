import type { LngLat, Polygon } from "../types";

// --- Seeded PRNG (mulberry32) so mock data is stable across reloads ---
export function seedFromString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Distance / area math (equirectangular approximation, fine at this scale) ---
const EARTH_RADIUS_M = 6371000;
const DEG_TO_RAD = Math.PI / 180;

export function metersPerDegree(lat: number) {
  const lngMeters = Math.cos(lat * DEG_TO_RAD) * ((2 * Math.PI * EARTH_RADIUS_M) / 360);
  const latMeters = (2 * Math.PI * EARTH_RADIUS_M) / 360;
  return { lngMeters, latMeters };
}

export function haversineDistanceKm(a: LngLat, b: LngLat): number {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLng = (lng2 - lng1) * DEG_TO_RAD;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return (EARTH_RADIUS_M * c) / 1000;
}

// Shoelace formula on the outer ring, converted to sq meters via local flat approximation
export function polygonAreaSqM(polygon: Polygon): number {
  const ring = polygon[0];
  if (!ring || ring.length < 3) return 0;
  const [lng0, lat0] = ring[0];
  const { lngMeters, latMeters } = metersPerDegree(lat0);
  const pts = ring.map(([lng, lat]) => [
    (lng - lng0) * lngMeters,
    (lat - lat0) * latMeters,
  ]);
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

export function sqmToAcres(sqm: number): number {
  return sqm / 4046.8564224;
}

export function acresToSqm(acres: number): number {
  return acres * 4046.8564224;
}

export function polygonCentroid(polygon: Polygon): LngLat {
  const ring = polygon[0];
  let x = 0;
  let y = 0;
  for (const [lng, lat] of ring) {
    x += lng;
    y += lat;
  }
  return [x / ring.length, y / ring.length];
}

// Ray-casting point-in-polygon (outer ring only — sufficient for this mock dataset)
export function pointInPolygon(point: LngLat, polygon: Polygon): boolean {
  const [x, y] = point;
  const ring = polygon[0];
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// --- Procedural polygon generation ---

/** Small jittered quadrilateral around a center point, sized in meters. */
export function generateParcelPolygon(
  center: LngLat,
  rng: () => number,
  minSizeM = 50,
  maxSizeM = 200
): Polygon {
  const [lng, lat] = center;
  const { lngMeters, latMeters } = metersPerDegree(lat);
  const w = minSizeM + rng() * (maxSizeM - minSizeM);
  const h = minSizeM + rng() * (maxSizeM - minSizeM);
  const skew = (rng() - 0.5) * 0.3;

  const corners: [number, number][] = [
    [-w / 2, -h / 2],
    [w / 2 + skew * w, -h / 2 - skew * h * 0.5],
    [w / 2, h / 2],
    [-w / 2 - skew * w * 0.5, h / 2 + skew * h],
  ];

  const ring: LngLat[] = corners.map(([dx, dy]) => [
    lng + dx / lngMeters,
    lat + dy / latMeters,
  ]);
  ring.push(ring[0]);
  return [ring];
}

/** Larger convex-ish polygon around a center, used for admin boundaries. */
export function generateBoundaryPolygon(
  center: LngLat,
  radiusKm: number,
  rng: () => number,
  sides = 8
): Polygon {
  const [lng, lat] = center;
  const { lngMeters, latMeters } = metersPerDegree(lat);
  const radiusM = radiusKm * 1000;
  const ring: LngLat[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const r = radiusM * (0.7 + rng() * 0.3);
    const dx = Math.cos(angle) * r;
    const dy = Math.sin(angle) * r;
    ring.push([lng + dx / lngMeters, lat + dy / latMeters]);
  }
  ring.push(ring[0]);
  return [ring];
}

/** Jitters a point within a radius (km) of a center — used to scatter parcel centers within a village. */
export function jitterPoint(center: LngLat, radiusKm: number, rng: () => number): LngLat {
  const [lng, lat] = center;
  const { lngMeters, latMeters } = metersPerDegree(lat);
  const angle = rng() * Math.PI * 2;
  const r = rng() * radiusKm * 1000;
  return [lng + (Math.cos(angle) * r) / lngMeters, lat + (Math.sin(angle) * r) / latMeters];
}
