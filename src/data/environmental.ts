import type { EnvFeature, Polygon } from "../types";
import { generateBoundaryPolygon, mulberry32, seedFromString } from "../lib/geo";

function poly(center: [number, number], radiusKm: number, seed: string, sides = 7): Polygon {
  return generateBoundaryPolygon(center, radiusKm, mulberry32(seedFromString(seed)), sides);
}

export const envFeatures: EnvFeature[] = [
  // Coastal Regulation Zone — real coastal stretches
  { id: "crz-besant-nagar", type: "crz", name: "CRZ — Besant Nagar Coast", districtId: "chennai", boundary: poly([80.278, 12.998], 1.2, "crz-1") },
  { id: "crz-marina", type: "crz", name: "CRZ — Marina Coast", districtId: "chennai", boundary: poly([80.283, 13.048], 1.4, "crz-2") },
  { id: "crz-marakkanam", type: "crz", name: "CRZ — Marakkanam Coast", districtId: "villupuram", boundary: poly([79.72, 12.19], 2.0, "crz-3") },

  // Reserve Forest — Western Ghats foothills (Coimbatore), Sirumalai (Madurai), Kalvarayan Hills (Villupuram)
  { id: "rf-mettupalayam", type: "reserveForest", name: "Mettupalayam Reserve Forest", districtId: "coimbatore", boundary: poly([76.83, 11.33], 5.5, "rf-1", 9) },
  { id: "rf-anaikatti", type: "reserveForest", name: "Anaikatti Reserve Forest", districtId: "coimbatore", boundary: poly([76.78, 11.22], 4.5, "rf-2", 8) },
  { id: "rf-sirumalai", type: "reserveForest", name: "Sirumalai Reserve Forest", districtId: "madurai", boundary: poly([78.02, 10.15], 6, "rf-3", 9) },
  { id: "rf-kalvarayan", type: "reserveForest", name: "Kalvarayan Hills Reserve Forest", districtId: "villupuram", boundary: poly([79.5, 12.32], 5, "rf-4", 8) },

  // Eco Sensitive Zones — buffers around forest/hill tracts
  { id: "esz-nilgiris-buffer", type: "ecoSensitive", name: "Nilgiris Buffer Eco-Sensitive Zone", districtId: "coimbatore", boundary: poly([76.87, 11.28], 7, "esz-1", 8) },
  { id: "esz-sirumalai-buffer", type: "ecoSensitive", name: "Sirumalai Eco-Sensitive Zone", districtId: "madurai", boundary: poly([78.0, 10.11], 8, "esz-2", 8) },
  { id: "esz-kalvarayan-buffer", type: "ecoSensitive", name: "Kalvarayan Hills Eco-Sensitive Zone", districtId: "villupuram", boundary: poly([79.48, 12.35], 7, "esz-3", 8) },

  // Flood Inundation Area — Cauvery delta, Thanjavur
  { id: "flood-thiruvaiyaru", type: "floodZone", name: "Cauvery Flood Plain — Thiruvaiyaru", districtId: "thanjavur", boundary: poly([79.08, 10.855], 3.5, "flood-1", 8) },
  { id: "flood-kumbakonam", type: "floodZone", name: "Cauvery-Arasalar Flood Plain — Kumbakonam", districtId: "thanjavur", boundary: poly([79.36, 10.95], 4, "flood-2", 8) },
  { id: "flood-papanasam", type: "floodZone", name: "Delta Flood Zone — Papanasam", districtId: "thanjavur", boundary: poly([79.27, 10.91], 3.5, "flood-3", 8) },

  // Water bodies — a few tanks/rivers per district
  { id: "wb-velachery-lake", type: "waterBody", name: "Velachery Lake", districtId: "chennai", boundary: poly([80.221, 12.978], 0.5, "wb-1", 8) },
  { id: "wb-adyar-river", type: "waterBody", name: "Adyar River Stretch", districtId: "chennai", boundary: poly([80.25, 13.0], 0.35, "wb-2", 8) },
  { id: "wb-singanallur-lake", type: "waterBody", name: "Singanallur Lake", districtId: "coimbatore", boundary: poly([77.02, 11.0], 0.6, "wb-3", 8) },
  { id: "wb-ukkadam-tank", type: "waterBody", name: "Ukkadam Periyakulam Tank", districtId: "coimbatore", boundary: poly([76.96, 10.99], 0.4, "wb-4", 8) },
  { id: "wb-vaigai-river", type: "waterBody", name: "Vaigai River Stretch", districtId: "madurai", boundary: poly([78.1, 9.93], 0.4, "wb-5", 8) },
  { id: "wb-vandiyur-tank", type: "waterBody", name: "Vandiyur Mariamman Tank", districtId: "madurai", boundary: poly([78.14, 9.92], 0.35, "wb-6", 8) },
  { id: "wb-cauvery-thanjavur", type: "waterBody", name: "Cauvery River Stretch — Thanjavur", districtId: "thanjavur", boundary: poly([79.16, 10.79], 0.5, "wb-7", 8) },
  { id: "wb-vallam-tank", type: "waterBody", name: "Vallam Irrigation Tank", districtId: "thanjavur", boundary: poly([79.18, 10.74], 0.4, "wb-8", 8) },
  { id: "wb-gingee-river", type: "waterBody", name: "Gingee River Stretch", districtId: "villupuram", boundary: poly([79.52, 11.95], 0.4, "wb-9", 8) },
  { id: "wb-vanur-tank", type: "waterBody", name: "Vanur Irrigation Tank", districtId: "villupuram", boundary: poly([79.6, 11.93], 0.35, "wb-10", 8) },
];

export function envFeaturesByType(type: EnvFeature["type"]) {
  return envFeatures.filter((f) => f.type === type);
}
