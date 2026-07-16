import type { BoundaryFeature, EnvFeature, Facility, Parcel, RailFeature, RoadFeature } from "../types";

export function parcelsToFC(items: Parcel[]) {
  return {
    type: "FeatureCollection" as const,
    features: items.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Polygon" as const, coordinates: p.boundary },
      properties: { id: p.id, classification: p.classification, districtId: p.districtId },
    })),
  };
}

export function boundariesToFC(items: BoundaryFeature[]) {
  return {
    type: "FeatureCollection" as const,
    features: items.map((b) => ({
      type: "Feature" as const,
      geometry: { type: "Polygon" as const, coordinates: b.boundary },
      properties: { id: b.id, level: b.level, name: b.name },
    })),
  };
}

export function envToFC(items: EnvFeature[]) {
  return {
    type: "FeatureCollection" as const,
    features: items.map((e) => ({
      type: "Feature" as const,
      geometry: { type: "Polygon" as const, coordinates: e.boundary },
      properties: { id: e.id, type: e.type, name: e.name },
    })),
  };
}

export function facilitiesToFC(items: Facility[]) {
  return {
    type: "FeatureCollection" as const,
    features: items.map((f) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: f.position },
      properties: { id: f.id, name: f.name, category: f.category },
    })),
  };
}

export function roadsToFC(items: RoadFeature[]) {
  return {
    type: "FeatureCollection" as const,
    features: items.map((r) => ({
      type: "Feature" as const,
      geometry: { type: "LineString" as const, coordinates: r.path },
      properties: { id: r.id, name: r.name, roadType: r.type },
    })),
  };
}

export function railsToFC(items: RailFeature[]) {
  return {
    type: "FeatureCollection" as const,
    features: items.map((r) => ({
      type: "Feature" as const,
      geometry: { type: "LineString" as const, coordinates: r.path },
      properties: { id: r.id, name: r.name },
    })),
  };
}
