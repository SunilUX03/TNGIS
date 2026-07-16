import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "../../store/useMapStore";
import { useNavStore } from "../../store/useNavStore";
import { SHEET_HEIGHTS } from "../layout/BottomSheet";
import { useLayerStore } from "../../store/useLayerStore";
import { layerCategories } from "../../data/layerCategories";
import { parcels, parcelById } from "../../data/parcels";
import { allBoundaries } from "../../data/boundaries";
import { envFeatures } from "../../data/environmental";
import { facilities } from "../../data/facilities";
import { roads, railways } from "../../data/roads";
import { parcelsToFC, boundariesToFC, envToFC, facilitiesToFC, roadsToFC, railsToFC } from "../../lib/geojson";
import { CLASSIFICATION_COLOR, ENV_COLOR } from "../../lib/mapColors";
import { generateBoundaryPolygon, mulberry32, seedFromString } from "../../lib/geo";

const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const TN_CENTER: [number, number] = [78.75, 11.05];
const TN_ZOOM = 6.4;

// Maps every leaf id whose dataRef.kind === "boundary" to the map "level" property value
const BOUNDARY_LEVEL_LAYER: Record<string, string> = {
  "state-boundary": "state",
  "district-boundary": "district",
  "taluk-boundary": "taluk",
  "village-panchayat-boundary": "village",
  "municipal-ward-boundary": "ward",
  "assembly-constituency": "assembly",
  "parliamentary-constituency": "parliament",
};

function findLeafDataRef(leafId: string) {
  for (const cat of layerCategories) {
    for (const l of cat.layers) {
      if (l.id === leafId) return l.dataRef;
    }
  }
  return undefined;
}

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const pinMarkerRef = useRef<maplibregl.Marker | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: TN_CENTER,
      zoom: TN_ZOOM,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");
    (window as any).__tngisMap = map;

    map.on("load", () => {
      loadedRef.current = true;
      setupLayers(map);
      wireClicks(map);
      // apply any store state that was set before load
      syncAllFromStore(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
      (window as any).__tngisMap = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reposition the scale bar so the bottom sheet never covers it
  useEffect(() => {
    return useNavStore.subscribe((s) => {
      const el = containerRef.current?.querySelector(".maplibregl-ctrl-bottom-left") as HTMLElement | null;
      if (!el) return;
      el.style.bottom = `${SHEET_HEIGHTS[s.sheetSnap] + 12}px`;
    });
  }, []);

  // fly-to
  useEffect(() => {
    return useMapStore.subscribe((s, prev) => {
      if (s.flyToRequest && s.flyToRequest.requestId !== prev.flyToRequest?.requestId) {
        mapRef.current?.flyTo({
          center: s.flyToRequest.center,
          zoom: s.flyToRequest.zoom,
          duration: 650,
          essential: true,
        });
      }
    });
  }, []);

  // highlight / result / admin-highlight / buffer preview / pin
  useEffect(() => {
    return useMapStore.subscribe((s) => {
      const map = mapRef.current;
      if (!map || !loadedRef.current) return;
      applyIdFilter(map, "highlight-fill", s.highlightParcelIds);
      applyIdFilter(map, "highlight-line", s.highlightParcelIds);
      applyIdFilter(map, "adjoining-line", s.adjoiningParcelIds);
      applyIdFilter(map, "result-fill", s.resultParcelIds);
      applyIdFilter(map, "result-line", s.resultParcelIds);
      applyAdminHighlight(map, s.activeAdminBoundaryIds);
      applyBufferPreview(map, s.bufferPreview);
      applyPinDrop(map, pinMarkerRef, s.pinDrop);
      applyNearbyFacilities(map, s.nearbyFacilityIds);
    });
  }, []);

  // layer panel on/off + opacity
  useEffect(() => {
    return useLayerStore.subscribe((s) => {
      const map = mapRef.current;
      if (!map || !loadedRef.current) return;
      applyLayerPanelState(map, s.on, s.opacity);
    });
  }, []);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

function syncAllFromStore(map: maplibregl.Map) {
  const mapState = useMapStore.getState();
  applyIdFilter(map, "highlight-fill", mapState.highlightParcelIds);
  applyIdFilter(map, "highlight-line", mapState.highlightParcelIds);
  applyIdFilter(map, "adjoining-line", mapState.adjoiningParcelIds);
  applyIdFilter(map, "result-fill", mapState.resultParcelIds);
  applyIdFilter(map, "result-line", mapState.resultParcelIds);
  applyNearbyFacilities(map, mapState.nearbyFacilityIds);
  const layerState = useLayerStore.getState();
  applyLayerPanelState(map, layerState.on, layerState.opacity);
}

function applyIdFilter(map: maplibregl.Map, layerId: string, ids: string[]) {
  if (!map.getLayer(layerId)) return;
  map.setFilter(layerId, ["in", ["get", "id"], ["literal", ids]]);
}

function applyAdminHighlight(map: maplibregl.Map, ids: string[]) {
  if (!map.getLayer("admin-highlight-line")) return;
  map.setFilter("admin-highlight-line", ["in", ["get", "id"], ["literal", ids]]);
  map.setFilter("admin-highlight-fill", ["in", ["get", "id"], ["literal", ids]]);
}

function applyBufferPreview(map: maplibregl.Map, preview: { center: [number, number]; radiusKm: number } | null) {
  const src = map.getSource("buffer-preview") as maplibregl.GeoJSONSource | undefined;
  if (!src) return;
  if (!preview) {
    src.setData({ type: "FeatureCollection", features: [] });
    return;
  }
  const ring = generateBoundaryPolygon(preview.center, preview.radiusKm, mulberry32(seedFromString("buffer-static")), 48);
  // regenerate a near-perfect circle (generateBoundaryPolygon jitters radius; override for a clean preview circle)
  const clean = circlePolygon(preview.center, preview.radiusKm, 48);
  void ring;
  src.setData({
    type: "FeatureCollection",
    features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: clean }, properties: {} }],
  });
}

function circlePolygon(center: [number, number], radiusKm: number, sides: number) {
  const [lng, lat] = center;
  const latMeters = 111320;
  const lngMeters = 111320 * Math.cos((lat * Math.PI) / 180);
  const radiusM = radiusKm * 1000;
  const coords: [number, number][] = [];
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    coords.push([lng + (Math.cos(angle) * radiusM) / lngMeters, lat + (Math.sin(angle) * radiusM) / latMeters]);
  }
  return [coords];
}

function applyPinDrop(map: maplibregl.Map, ref: React.MutableRefObject<maplibregl.Marker | null>, pos: [number, number] | null) {
  if (!pos) {
    ref.current?.remove();
    ref.current = null;
    return;
  }
  if (!ref.current) {
    const el = document.createElement("div");
    el.style.width = "22px";
    el.style.height = "22px";
    el.style.borderRadius = "50%";
    el.style.background = "#0066cc";
    el.style.border = "3px solid white";
    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
    ref.current = new maplibregl.Marker({ element: el }).setLngLat(pos).addTo(map);
  } else {
    ref.current.setLngLat(pos);
  }
}

function applyNearbyFacilities(map: maplibregl.Map, ids: string[]) {
  const src = map.getSource("nearby-result") as maplibregl.GeoJSONSource | undefined;
  if (!src) return;
  const items = facilities.filter((f) => ids.includes(f.id));
  src.setData(facilitiesToFC(items));
}

function applyLayerPanelState(map: maplibregl.Map, on: Record<string, boolean>, opacity: Record<string, number>) {
  // Boundary levels
  for (const [leafId, level] of Object.entries(BOUNDARY_LEVEL_LAYER)) {
    const layerId = `admin-${level}-line`;
    if (!map.getLayer(layerId)) continue;
    const visible = !!on[leafId];
    map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
    if (visible) map.setPaintProperty(layerId, "line-opacity", (opacity[leafId] ?? 80) / 100);
  }

  // Parcel-kind leaves (Survey Parcel = all, Forest Land / Agricultural Land / Water Body Poramboke = filtered)
  const parcelLeaves = layerCategories
    .flatMap((c) => c.layers)
    .filter((l) => l.dataRef?.kind === "parcels");
  const activeFilters = parcelLeaves.filter((l) => on[l.id]).map((l) => l.dataRef?.filter);
  const anyParcelOn = activeFilters.length > 0;
  if (map.getLayer("parcels-fill")) {
    map.setLayoutProperty("parcels-fill", "visibility", anyParcelOn ? "visible" : "none");
    map.setLayoutProperty("parcels-line", "visibility", anyParcelOn ? "visible" : "none");
    if (activeFilters.includes(undefined)) {
      map.setFilter("parcels-fill", null);
      map.setFilter("parcels-line", null);
    } else if (anyParcelOn) {
      map.setFilter("parcels-fill", ["in", ["get", "classification"], ["literal", activeFilters]]);
      map.setFilter("parcels-line", ["in", ["get", "classification"], ["literal", activeFilters]]);
    }
    const maxOpacity = Math.max(0, ...parcelLeaves.filter((l) => on[l.id]).map((l) => opacity[l.id] ?? 80)) / 100;
    if (anyParcelOn) map.setPaintProperty("parcels-fill", "fill-opacity", maxOpacity * 0.4);
  }

  // Env layers
  for (const type of ["crz", "reserveForest", "floodZone", "ecoSensitive", "waterBody"] as const) {
    const leaf = layerCategories.flatMap((c) => c.layers).find((l) => l.dataRef?.kind === "env" && l.dataRef.filter === type);
    if (!leaf || !map.getLayer(`env-${type}-fill`)) continue;
    const visible = !!on[leaf.id];
    map.setLayoutProperty(`env-${type}-fill`, "visibility", visible ? "visible" : "none");
    map.setLayoutProperty(`env-${type}-line`, "visibility", visible ? "visible" : "none");
    if (visible) map.setPaintProperty(`env-${type}-fill`, "fill-opacity", ((opacity[leaf.id] ?? 80) / 100) * 0.45);
  }

  // Roads
  const roadLeaves = layerCategories.flatMap((c) => c.layers).filter((l) => l.dataRef?.kind === "road");
  const activeRoadTypes = roadLeaves.filter((l) => on[l.id]).map((l) => l.dataRef?.filter);
  if (map.getLayer("roads-line")) {
    const visible = activeRoadTypes.length > 0;
    map.setLayoutProperty("roads-line", "visibility", visible ? "visible" : "none");
    if (visible) map.setFilter("roads-line", ["in", ["get", "roadType"], ["literal", activeRoadTypes]]);
  }

  // Rail
  const railLeaf = layerCategories.flatMap((c) => c.layers).find((l) => l.dataRef?.kind === "rail");
  if (railLeaf && map.getLayer("rails-line")) {
    map.setLayoutProperty("rails-line", "visibility", on[railLeaf.id] ? "visible" : "none");
  }

  // Facilities
  const facilityLeaves = layerCategories.flatMap((c) => c.layers).filter((l) => l.dataRef?.kind === "facility");
  const activeCategories = facilityLeaves.filter((l) => on[l.id]).map((l) => l.dataRef?.filter);
  if (map.getLayer("facilities-circle")) {
    const visible = activeCategories.length > 0;
    map.setLayoutProperty("facilities-circle", "visibility", visible ? "visible" : "none");
    if (visible) map.setFilter("facilities-circle", ["in", ["get", "category"], ["literal", activeCategories]]);
  }
}

function setupLayers(map: maplibregl.Map) {
  // --- State boundary ---
  const stateFeature = allBoundaries.find((b) => b.level === "state")!;
  map.addSource("state", { type: "geojson", data: boundariesToFC([stateFeature]) });
  map.addLayer({ id: "state-fill", type: "fill", source: "state", paint: { "fill-color": "#0066cc", "fill-opacity": 0.03 } });
  map.addLayer({ id: "state-line", type: "line", source: "state", paint: { "line-color": "#0066cc", "line-width": 2 } });

  // --- Admin boundaries (district/taluk/village/ward/assembly/parliament) ---
  const adminFeatures = allBoundaries.filter((b) => b.level !== "state");
  map.addSource("admin", { type: "geojson", data: boundariesToFC(adminFeatures) });

  const levelStyles: Record<string, { color: string; width: number; dash?: number[] }> = {
    district: { color: "#1d1d1f", width: 1.5 },
    taluk: { color: "#333333", width: 1.2 },
    village: { color: "#7a7a7a", width: 1 },
    ward: { color: "#7a7a7a", width: 1, dash: [2, 2] },
    assembly: { color: "#0066cc", width: 1.2, dash: [4, 2] },
    parliament: { color: "#b95000", width: 1.2, dash: [1, 3] },
  };
  for (const [level, style] of Object.entries(levelStyles)) {
    map.addLayer({
      id: `admin-${level}-line`,
      type: "line",
      source: "admin",
      filter: ["==", ["get", "level"], level],
      layout: { visibility: "none" },
      paint: {
        "line-color": style.color,
        "line-width": style.width,
        ...(style.dash ? { "line-dasharray": style.dash } : {}),
      },
    });
  }

  map.addLayer({
    id: "admin-highlight-fill",
    type: "fill",
    source: "admin",
    filter: ["in", ["get", "id"], ["literal", []]],
    paint: { "fill-color": "#0066cc", "fill-opacity": 0.12 },
  });
  map.addLayer({
    id: "admin-highlight-line",
    type: "line",
    source: "admin",
    filter: ["in", ["get", "id"], ["literal", []]],
    paint: { "line-color": "#0066cc", "line-width": 3 },
  });

  // --- Environmental layers ---
  map.addSource("env", { type: "geojson", data: envToFC(envFeatures) });
  for (const type of Object.keys(ENV_COLOR) as Array<keyof typeof ENV_COLOR>) {
    map.addLayer({
      id: `env-${type}-fill`,
      type: "fill",
      source: "env",
      filter: ["==", ["get", "type"], type],
      layout: { visibility: "none" },
      paint: { "fill-color": ENV_COLOR[type], "fill-opacity": 0.35 },
    });
    map.addLayer({
      id: `env-${type}-line`,
      type: "line",
      source: "env",
      filter: ["==", ["get", "type"], type],
      layout: { visibility: "none" },
      paint: { "line-color": ENV_COLOR[type], "line-width": 1.5 },
    });
  }

  // --- Parcels ---
  map.addSource("parcels", { type: "geojson", data: parcelsToFC(parcels) });
  map.addLayer({
    id: "parcels-fill",
    type: "fill",
    source: "parcels",
    layout: { visibility: "none" },
    paint: {
      "fill-color": [
        "match",
        ["get", "classification"],
        "Agricultural", CLASSIFICATION_COLOR.Agricultural,
        "Non-Agricultural", CLASSIFICATION_COLOR["Non-Agricultural"],
        "Government Vacant", CLASSIFICATION_COLOR["Government Vacant"],
        "Forest", CLASSIFICATION_COLOR.Forest,
        "Water Body", CLASSIFICATION_COLOR["Water Body"],
        "#999999",
      ],
      "fill-opacity": 0.35,
    },
  });
  map.addLayer({
    id: "parcels-line",
    type: "line",
    source: "parcels",
    layout: { visibility: "none" },
    paint: { "line-color": "#1d1d1f", "line-width": 0.6, "line-opacity": 0.5 },
  });

  // invisible always-on hit layer for click queries regardless of visual toggle state
  map.addLayer({
    id: "parcels-hit",
    type: "fill",
    source: "parcels",
    paint: { "fill-color": "#000000", "fill-opacity": 0 },
  });

  // highlight (search selection) / adjoining / result (synced list) layers, all reading the parcels source
  map.addLayer({
    id: "highlight-fill",
    type: "fill",
    source: "parcels",
    filter: ["in", ["get", "id"], ["literal", []]],
    paint: { "fill-color": "#0066cc", "fill-opacity": 0.25 },
  });
  map.addLayer({
    id: "highlight-line",
    type: "line",
    source: "parcels",
    filter: ["in", ["get", "id"], ["literal", []]],
    paint: { "line-color": "#0066cc", "line-width": 3 },
  });
  map.addLayer({
    id: "adjoining-line",
    type: "line",
    source: "parcels",
    filter: ["in", ["get", "id"], ["literal", []]],
    paint: { "line-color": "#7a7a7a", "line-width": 1, "line-dasharray": [2, 2] },
  });
  map.addLayer({
    id: "result-fill",
    type: "fill",
    source: "parcels",
    filter: ["in", ["get", "id"], ["literal", []]],
    paint: { "fill-color": "#0066cc", "fill-opacity": 0.18 },
  });
  map.addLayer({
    id: "result-line",
    type: "line",
    source: "parcels",
    filter: ["in", ["get", "id"], ["literal", []]],
    paint: { "line-color": "#0066cc", "line-width": 2 },
  });

  // --- Roads / Rail ---
  map.addSource("roads", { type: "geojson", data: roadsToFC(roads) });
  map.addLayer({
    id: "roads-line",
    type: "line",
    source: "roads",
    layout: { visibility: "none", "line-cap": "round" },
    paint: { "line-color": "#5a5a5a", "line-width": 2.5 },
  });
  map.addSource("rails", { type: "geojson", data: railsToFC(railways) });
  map.addLayer({
    id: "rails-line",
    type: "line",
    source: "rails",
    layout: { visibility: "none" },
    paint: { "line-color": "#333333", "line-width": 1.5, "line-dasharray": [1, 1.5] },
  });

  // --- Facilities ---
  map.addSource("facilities", { type: "geojson", data: facilitiesToFC(facilities) });
  map.addLayer({
    id: "facilities-circle",
    type: "circle",
    source: "facilities",
    layout: { visibility: "none" },
    paint: {
      "circle-radius": 6,
      "circle-color": "#0066cc",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  // --- Nearby-facilities flow result markers (separate from layer-panel facilities) ---
  map.addSource("nearby-result", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
  map.addLayer({
    id: "nearby-result-circle",
    type: "circle",
    source: "nearby-result",
    paint: {
      "circle-radius": 8,
      "circle-color": "#0066cc",
      "circle-stroke-width": 3,
      "circle-stroke-color": "#ffffff",
    },
  });

  // --- Buffer preview (Analyze) ---
  map.addSource("buffer-preview", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
  map.addLayer({
    id: "buffer-preview-fill",
    type: "fill",
    source: "buffer-preview",
    paint: { "fill-color": "#0066cc", "fill-opacity": 0.1 },
  });
  map.addLayer({
    id: "buffer-preview-line",
    type: "line",
    source: "buffer-preview",
    paint: { "line-color": "#0066cc", "line-width": 1.5, "line-dasharray": [3, 2] },
  });
}

function wireClicks(map: maplibregl.Map) {
  map.on("click", (e) => {
    const clickMode = useMapStore.getState().clickMode;

    if (clickMode === "area-lookup") {
      useMapStore.getState().setPinDrop([e.lngLat.lng, e.lngLat.lat]);
      return;
    }

    const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
      [e.point.x - 4, e.point.y - 4],
      [e.point.x + 4, e.point.y + 4],
    ];
    const features = map.queryRenderedFeatures(bbox, { layers: ["parcels-hit"] });
    const ids = Array.from(new Set(features.map((f) => f.properties?.id as string)));
    if (ids.length === 0) return;

    if (ids.length > 1) {
      useMapStore.getState().setMultiTapCandidates(ids);
      return;
    }

    const id = ids[0];
    if (clickMode === "risk-select") {
      useMapStore.getState().setRiskParcelId(id);
      return;
    }
    const handler = useMapStore.getState().resultClickHandler;
    if (handler?.kind === "parcel" && useMapStore.getState().resultParcelIds.includes(id)) {
      handler.onSelect(id);
      return;
    }
    selectParcelAsResult(id);
  });

  map.on("click", "nearby-result-circle", (e) => {
    const feature = e.features?.[0];
    const id = feature?.properties?.id as string | undefined;
    const handler = useMapStore.getState().resultClickHandler;
    if (id && handler?.kind === "facility") handler.onSelect(id);
  });

  map.on("mouseenter", "parcels-hit", () => (map.getCanvas().style.cursor = "pointer"));
  map.on("mouseleave", "parcels-hit", () => (map.getCanvas().style.cursor = ""));
  map.on("mouseenter", "nearby-result-circle", () => (map.getCanvas().style.cursor = "pointer"));
  map.on("mouseleave", "nearby-result-circle", () => (map.getCanvas().style.cursor = ""));
}

export function selectParcelAsResult(parcelId: string) {
  const parcel = parcelById(parcelId);
  if (!parcel) return;
  const adjoining = parcels
    .filter((p) => p.villageId === parcel.villageId && p.id !== parcel.id)
    .map((p) => p.id);
  useMapStore.getState().setHighlight([parcelId], adjoining);
  useMapStore.getState().flyTo(parcel.center, 16.5);
  useNavStore.getState().showResult(parcelId);
}

export { findLeafDataRef };
