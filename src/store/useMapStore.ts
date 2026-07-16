import { create } from "zustand";
import type { AdminLevel, LngLat } from "../types";

interface FlyToRequest {
  center: LngLat;
  zoom: number;
  requestId: number;
}

export type MapClickMode = "default" | "area-lookup" | "risk-select";

interface MapState {
  flyToRequest: FlyToRequest | null;
  highlightParcelIds: string[];
  adjoiningParcelIds: string[];
  resultParcelIds: string[]; // used to render synced list+map result sets (vacant land, analyze, facilities)
  pinDrop: LngLat | null;
  activeAdminLevel: AdminLevel;
  activeAdminBoundaryIds: string[];
  bufferPreview: { center: LngLat; radiusKm: number } | null;
  clickMode: MapClickMode;
  riskParcelId: string | null;
  multiTapCandidateIds: string[];
  resultClickHandler: { kind: "parcel" | "facility"; onSelect: (id: string) => void } | null;
  nearbyFacilityIds: string[];

  flyTo: (center: LngLat, zoom?: number) => void;
  setHighlight: (ids: string[], adjoining?: string[]) => void;
  clearHighlight: () => void;
  setResultParcels: (ids: string[]) => void;
  setPinDrop: (pos: LngLat | null) => void;
  setActiveAdminLevel: (level: AdminLevel) => void;
  setActiveAdminBoundaries: (ids: string[]) => void;
  setBufferPreview: (preview: { center: LngLat; radiusKm: number } | null) => void;
  setClickMode: (mode: MapClickMode) => void;
  setRiskParcelId: (id: string | null) => void;
  setMultiTapCandidates: (ids: string[]) => void;
  setResultClickHandler: (handler: { kind: "parcel" | "facility"; onSelect: (id: string) => void } | null) => void;
  setNearbyFacilityIds: (ids: string[]) => void;
}

let requestCounter = 0;

export const useMapStore = create<MapState>((set) => ({
  flyToRequest: null,
  highlightParcelIds: [],
  adjoiningParcelIds: [],
  resultParcelIds: [],
  pinDrop: null,
  activeAdminLevel: "village",
  activeAdminBoundaryIds: [],
  bufferPreview: null,
  clickMode: "default",
  riskParcelId: null,
  multiTapCandidateIds: [],
  resultClickHandler: null,
  nearbyFacilityIds: [],

  flyTo: (center, zoom = 15) =>
    set({ flyToRequest: { center, zoom, requestId: ++requestCounter } }),
  setHighlight: (ids, adjoining = []) =>
    set({ highlightParcelIds: ids, adjoiningParcelIds: adjoining }),
  clearHighlight: () => set({ highlightParcelIds: [], adjoiningParcelIds: [] }),
  setResultParcels: (ids) => set({ resultParcelIds: ids }),
  setPinDrop: (pos) => set({ pinDrop: pos }),
  setActiveAdminLevel: (level) => set({ activeAdminLevel: level }),
  setActiveAdminBoundaries: (ids) => set({ activeAdminBoundaryIds: ids }),
  setBufferPreview: (preview) => set({ bufferPreview: preview }),
  setClickMode: (mode) => set({ clickMode: mode }),
  setRiskParcelId: (id) => set({ riskParcelId: id }),
  setMultiTapCandidates: (ids) => set({ multiTapCandidateIds: ids }),
  setResultClickHandler: (handler) => set({ resultClickHandler: handler }),
  setNearbyFacilityIds: (ids) => set({ nearbyFacilityIds: ids }),
}));
