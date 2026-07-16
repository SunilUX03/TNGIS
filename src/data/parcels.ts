import type { LandClassification, OverlapFlags, Parcel } from "../types";
import { districts, villages } from "./geography";
import {
  generateParcelPolygon,
  jitterPoint,
  mulberry32,
  polygonCentroid,
  seedFromString,
} from "../lib/geo";

const GLV_TIER: Record<string, { min: number; max: number }> = {
  chennai: { min: 4000, max: 15000 },
  coimbatore: { min: 1500, max: 8000 },
  madurai: { min: 1500, max: 7000 },
  thanjavur: { min: 500, max: 3000 },
  villupuram: { min: 500, max: 2800 },
};

const CLASS_GLV_MULT: Record<LandClassification, number | null> = {
  Agricultural: 0.28,
  "Non-Agricultural": 1.0,
  "Government Vacant": 0.55,
  Forest: null,
  "Water Body": null,
};

// Villages with elevated real-world likelihood of a given overlap flag
const CRZ_BIAS = new Set(["besant-nagar", "adyar", "ozhukarai", "sithalingamadam"]);
const FOREST_BIAS = new Set(["kalveerampalayam", "periyanaickenpalayam", "thudiyalur", "alanganallur", "melmalayanur"]);
const FLOOD_BIAS = new Set(["vallam", "thiruvaiyaru", "darasuram", "swamimalai", "sooriyanarkoil", "kabisthalam"]);
const ECO_BIAS = new Set(["kalveerampalayam", "periyanaickenpalayam", "alanganallur", "sholavandan", "melmalayanur"]);

// Recent dates within the last ~6 months of "today" (2026-07-16), deterministic per seed.
function dataAsOfDate(rng: () => number): string {
  const today = new Date("2026-07-16T00:00:00Z");
  const daysAgo = Math.floor(rng() * 182);
  const d = new Date(today.getTime() - daysAgo * 86400000);
  return d.toISOString().slice(0, 10);
}

function surveyNumber(rng: () => number): string {
  const base = 1 + Math.floor(rng() * 480);
  const sub = 1 + Math.floor(rng() * 9);
  const letters = ["A", "B", "C", "D"];
  const letter = rng() > 0.4 ? letters[Math.floor(rng() * letters.length)] : "";
  return `${base}/${sub}${letter}`;
}

function pickClassification(rng: () => number): LandClassification {
  const r = rng();
  if (r < 0.38) return "Agricultural";
  if (r < 0.63) return "Non-Agricultural";
  if (r < 0.78) return "Government Vacant";
  if (r < 0.89) return "Forest";
  return "Water Body";
}

function areaForClassification(cls: LandClassification, rng: () => number, targetBucket?: "small" | "mid" | "large"): number {
  switch (cls) {
    case "Agricultural":
      return round2(0.5 + rng() * 7.5);
    case "Non-Agricultural":
      return round2(0.05 + rng() * 1.95);
    case "Forest":
      return round2(15 + rng() * 90);
    case "Water Body":
      return round2(1 + rng() * 40);
    case "Government Vacant": {
      if (targetBucket === "small") return round2(3 + rng() * 2);
      if (targetBucket === "mid") return round2(5 + rng() * 45);
      if (targetBucket === "large") return round2(50 + rng() * 100);
      const r = rng();
      if (r < 0.35) return round2(3 + rng() * 2);
      if (r < 0.75) return round2(5 + rng() * 45);
      return round2(50 + rng() * 100);
    }
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function overlapsForVillage(villageId: string, rng: () => number): OverlapFlags {
  return {
    crz: CRZ_BIAS.has(villageId) ? rng() < 0.6 : rng() < 0.03,
    reserveForest: FOREST_BIAS.has(villageId) ? rng() < 0.45 : rng() < 0.02,
    floodZone: FLOOD_BIAS.has(villageId) ? rng() < 0.5 : rng() < 0.03,
    ecoSensitive: ECO_BIAS.has(villageId) ? rng() < 0.4 : rng() < 0.02,
  };
}

// Villupuram deliberately has zero 50+ acre Government Vacant parcels — exercises the empty-result UI
const NO_LARGE_VACANT_DISTRICTS = new Set(["villupuram"]);

function buildParcelsForVillage(villageId: string, govBuckets: Array<"small" | "mid" | "large">): Parcel[] {
  const village = villages.find((v) => v.id === villageId)!;
  const district = districts.find((d) => d.id === village.taluketDistrictId)!;
  const rng = mulberry32(seedFromString("parcels-" + villageId));
  const count = 5 + Math.floor(rng() * 6); // 5-10
  const glvTier = GLV_TIER[district.id];

  const parcels: Parcel[] = [];
  for (let i = 0; i < count; i++) {
    let bucket = govBuckets[i];
    if (bucket === "large" && NO_LARGE_VACANT_DISTRICTS.has(district.id)) bucket = "mid";
    const classification = bucket ? "Government Vacant" : pickClassification(rng);
    let areaAcres = areaForClassification(classification, rng, bucket);
    if (classification === "Government Vacant" && areaAcres >= 50 && NO_LARGE_VACANT_DISTRICTS.has(district.id)) {
      areaAcres = round2(5 + rng() * 40);
    }
    const parcelCenter = jitterPoint(village.center, 2.2, rng);
    const boundary = generateParcelPolygon(parcelCenter, rng, 40 + Math.sqrt(areaAcres) * 25, 90 + Math.sqrt(areaAcres) * 40);
    const center = polygonCentroid(boundary);

    const mult = CLASS_GLV_MULT[classification];
    const glvPerSqft = mult === null ? null : Math.round(glvTier.min + rng() * (glvTier.max - glvTier.min)) * mult;

    parcels.push({
      id: `${villageId}-${i + 1}`,
      surveyNo: surveyNumber(rng),
      villageId: village.id,
      villageName: village.name,
      villageNameTa: village.nameTa,
      taluketId: village.taluketId,
      taluketName: village.taluketName!,
      districtId: district.id,
      districtName: district.name,
      classification,
      areaAcres,
      glvPerSqft: glvPerSqft === null ? null : Math.round(glvPerSqft),
      boundary,
      center,
      overlaps: overlapsForVillage(village.id, rng),
      panchayatOrWard: village.panchayatOrWard,
      assemblyConstituency: village.taluketAssembly!,
      parliamentConstituency: village.taluketParliament!,
      distanceToHighwayKm: round2(0.3 + rng() * 14),
      dataAsOf: dataAsOfDate(rng),
    });
  }
  return parcels;
}

// Ensure every district has at least one Government Vacant parcel in each size bucket
// (small 3-5ac, mid 5-50ac, large 50+ac), distributed across its villages.
function govBucketPlan(): Record<string, Array<"small" | "mid" | "large">> {
  const plan: Record<string, Array<"small" | "mid" | "large">> = {};
  for (const district of districts) {
    const districtVillages = villages.filter((v) => v.taluketDistrictId === district.id);
    const buckets: Array<"small" | "mid" | "large"> = ["small", "mid", "large", "mid", "small"];
    districtVillages.forEach((v, idx) => {
      plan[v.id] = idx < buckets.length ? [buckets[idx]] : [];
    });
  }
  return plan;
}

function generateAllParcels(): Parcel[] {
  const plan = govBucketPlan();
  const all: Parcel[] = [];
  for (const village of villages) {
    all.push(...buildParcelsForVillage(village.id, plan[village.id] ?? []));
  }
  return all;
}

export const parcels: Parcel[] = generateAllParcels();

export function parcelsByDistrict(districtId: string) {
  return parcels.filter((p) => p.districtId === districtId);
}
export function parcelsByVillage(villageId: string) {
  return parcels.filter((p) => p.villageId === villageId);
}
export function parcelById(id: string) {
  return parcels.find((p) => p.id === id);
}
export function vacantParcels() {
  return parcels.filter((p) => p.classification === "Government Vacant");
}
