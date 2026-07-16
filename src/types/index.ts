// GeoJSON-ish primitives (kept minimal — not pulling in @types/geojson for a prototype)
export type LngLat = [number, number];
export type Polygon = LngLat[][]; // rings: [outer, ...holes]

export interface District {
  id: string;
  name: string;
  nameTa: string;
  center: LngLat;
}

export interface Taluk {
  id: string;
  districtId: string;
  name: string;
  nameTa: string;
  center: LngLat;
}

export interface Village {
  id: string;
  taluketId: string; // kept for compat, mirrors taluk id
  taluketName?: string;
  taluketDistrictId?: string;
  taluketDistrictName?: string;
  taluketAssembly?: string;
  taluketParliament?: string;
  name: string;
  nameTa: string;
  center: LngLat;
  panchayatOrWard: string;
}

export type LandClassification =
  | "Agricultural"
  | "Non-Agricultural"
  | "Government Vacant"
  | "Forest"
  | "Water Body";

export interface OverlapFlags {
  crz: boolean;
  reserveForest: boolean;
  floodZone: boolean;
  ecoSensitive: boolean;
}

export interface Parcel {
  id: string;
  surveyNo: string;
  villageId: string;
  villageName: string;
  villageNameTa: string;
  taluketId: string;
  taluketName: string;
  districtId: string;
  districtName: string;
  classification: LandClassification;
  areaAcres: number;
  glvPerSqft: number | null; // null when not applicable (e.g. water body)
  boundary: Polygon;
  center: LngLat;
  overlaps: OverlapFlags;
  panchayatOrWard: string;
  assemblyConstituency: string;
  parliamentConstituency: string;
  distanceToHighwayKm: number;
  dataAsOf: string; // ISO date
}

export type AdminLevel = "village" | "ward" | "constituency";

export interface BoundaryFeature {
  id: string;
  level: "state" | "district" | "taluk" | "village" | "ward" | "assembly" | "parliament";
  name: string;
  nameTa?: string;
  parentId?: string;
  boundary: Polygon;
}

export type EnvLayerType = "crz" | "reserveForest" | "floodZone" | "waterBody" | "ecoSensitive";

export interface EnvFeature {
  id: string;
  type: EnvLayerType;
  name: string;
  districtId: string;
  boundary: Polygon;
}

export type FacilityCategory =
  | "School"
  | "Hospital"
  | "Government Office"
  | "PDS Shop"
  | "Common Service Centre"
  | "Police Station"
  | "Bus Stand";

export interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  districtId: string;
  address: string;
  position: LngLat;
}

export interface RoadFeature {
  id: string;
  name: string;
  type: "National Highway" | "State Highway";
  path: LngLat[];
}

export interface RailFeature {
  id: string;
  name: string;
  path: LngLat[];
}

export interface LayerLeaf {
  id: string;
  name: string;
  hasData: boolean;
  dataRef?: { kind: "parcels" | "boundary" | "env" | "facility" | "road" | "rail"; filter?: string };
}

export interface LayerCategory {
  id: string;
  name: string;
  layers: LayerLeaf[];
}

export type SearchResultType = "parcel" | "village" | "district";

export interface SearchIndexEntry {
  id: string;
  type: SearchResultType;
  label: string;
  sublabel: string;
  center: LngLat;
  zoom: number;
  parcelId?: string;
}
