import type { BoundaryFeature, LngLat, Polygon } from "../types";
import { districts, taluks, villages } from "./geography";
import { generateBoundaryPolygon, mulberry32, seedFromString } from "../lib/geo";

// Simplified but geographically plausible Tamil Nadu state outline (not survey-accurate).
const tnOutlineRing: LngLat[] = [
  [80.33, 13.6], [80.23, 13.05], [80.18, 12.6], [79.85, 12.0], [79.84, 11.75],
  [79.77, 11.4], [79.85, 10.9], [79.84, 10.6], [79.5, 10.3], [79.3, 9.9],
  [78.9, 9.45], [78.5, 9.1], [78.15, 8.75], [77.9, 8.4], [77.55, 8.15],
  [77.35, 8.3], [77.2, 8.6], [77.1, 9.2], [77.25, 9.6], [76.95, 10.0],
  [76.85, 10.3], [76.9, 10.6], [76.75, 11.0], [76.85, 11.3], [76.7, 11.6],
  [76.6, 11.9], [76.85, 12.2], [77.2, 12.5], [77.5, 12.75], [78.0, 12.9],
  [78.3, 13.15], [78.6, 13.3], [79.0, 13.45], [79.4, 13.5], [79.9, 13.55],
  [80.15, 13.65], [80.33, 13.6],
];

export const stateBoundary: BoundaryFeature = {
  id: "tamil-nadu",
  level: "state",
  name: "Tamil Nadu",
  nameTa: "தமிழ்நாடு",
  boundary: [tnOutlineRing],
};

function ring(polygon: Polygon) {
  return polygon;
}

export const districtBoundaries: BoundaryFeature[] = districts.map((d) => {
  const rng = mulberry32(seedFromString("district-" + d.id));
  const radiusKm = d.id === "chennai" ? 16 : 38;
  return {
    id: "d-" + d.id,
    level: "district",
    name: d.name,
    nameTa: d.nameTa,
    boundary: ring(generateBoundaryPolygon(d.center, radiusKm, rng, 10)),
  };
});

export const talukBoundaries: BoundaryFeature[] = taluks.map((t) => {
  const rng = mulberry32(seedFromString("taluk-" + t.id));
  const radiusKm = t.districtId === "chennai" ? 5 : 12;
  return {
    id: "t-" + t.id,
    level: "taluk",
    name: t.name,
    nameTa: t.nameTa,
    parentId: t.districtId,
    boundary: ring(generateBoundaryPolygon(t.center, radiusKm, rng, 8)),
  };
});

export const villageBoundaries: BoundaryFeature[] = villages.map((v) => {
  const rng = mulberry32(seedFromString("village-" + v.id));
  return {
    id: "v-" + v.id,
    level: "village",
    name: v.name,
    nameTa: v.nameTa,
    parentId: v.taluketId,
    boundary: ring(generateBoundaryPolygon(v.center, 1.8, rng, 7)),
  };
});

// Chennai Corporation wards — treat each Chennai village/locality center as a ward seed
export const wardBoundaries: BoundaryFeature[] = villages
  .filter((v) => v.taluketDistrictId === "chennai")
  .map((v) => {
    const rng = mulberry32(seedFromString("ward-" + v.id));
    return {
      id: "w-" + v.id,
      level: "ward",
      name: v.panchayatOrWard,
      parentId: v.id,
      boundary: ring(generateBoundaryPolygon(v.center, 0.7, rng, 6)),
    };
  });

function clusterCentroid(centers: LngLat[]): LngLat {
  const x = centers.reduce((s, c) => s + c[0], 0) / centers.length;
  const y = centers.reduce((s, c) => s + c[1], 0) / centers.length;
  return [x, y];
}

function uniqueBy<T, K>(items: T[], key: (t: T) => K): T[] {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

const assemblyNames = uniqueBy(villages, (v) => v.taluketAssembly).map((v) => v.taluketAssembly!);
export const assemblyBoundaries: BoundaryFeature[] = assemblyNames.map((name) => {
  const members = villages.filter((v) => v.taluketAssembly === name);
  const center = clusterCentroid(members.map((v) => v.center));
  const rng = mulberry32(seedFromString("assembly-" + name));
  return {
    id: "ac-" + name.toLowerCase().replace(/\s+/g, "-"),
    level: "assembly",
    name,
    parentId: members[0].taluketDistrictId,
    boundary: ring(generateBoundaryPolygon(center, 9, rng, 8)),
  };
});

const parliamentNames = uniqueBy(villages, (v) => v.taluketParliament).map((v) => v.taluketParliament!);
export const parliamentBoundaries: BoundaryFeature[] = parliamentNames.map((name) => {
  const members = villages.filter((v) => v.taluketParliament === name);
  const center = clusterCentroid(members.map((v) => v.center));
  const rng = mulberry32(seedFromString("parliament-" + name));
  return {
    id: "pc-" + name.toLowerCase().replace(/\s+/g, "-"),
    level: "parliament",
    name,
    parentId: members[0].taluketDistrictId,
    boundary: ring(generateBoundaryPolygon(center, 20, rng, 9)),
  };
});

export const allBoundaries: BoundaryFeature[] = [
  stateBoundary,
  ...districtBoundaries,
  ...talukBoundaries,
  ...villageBoundaries,
  ...wardBoundaries,
  ...assemblyBoundaries,
  ...parliamentBoundaries,
];

export function boundaryForVillage(villageId: string) {
  return villageBoundaries.find((b) => b.parentId === undefined ? false : b.id === "v-" + villageId);
}
export function wardForVillage(villageId: string) {
  return wardBoundaries.find((b) => b.id === "w-" + villageId);
}
export function assemblyForName(name: string) {
  return assemblyBoundaries.find((b) => b.name === name);
}
export function parliamentForName(name: string) {
  return parliamentBoundaries.find((b) => b.name === name);
}
