import { useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, MapPin } from "lucide-react";
import { FlowHeader } from "../shared/FlowHeader";
import { Chip } from "../shared/Chip";
import { useNavStore } from "../../store/useNavStore";
import { useMapStore } from "../../store/useMapStore";
import { facilities } from "../../data/facilities";
import type { FacilityCategory } from "../../types";
import { haversineDistanceKm } from "../../lib/geo";
import { formatDistance } from "../../lib/format";

const CATEGORIES: FacilityCategory[] = [
  "School",
  "Hospital",
  "Government Office",
  "PDS Shop",
  "Common Service Centre",
  "Police Station",
];

export function NearbyFacilitiesFlow() {
  const closeHomeFlow = useNavStore((s) => s.closeHomeFlow);
  const pinDrop = useMapStore((s) => s.pinDrop);
  const [selectedCategories, setSelectedCategories] = useState<Set<FacilityCategory>>(new Set(CATEGORIES));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    useMapStore.getState().setClickMode("area-lookup");
    return () => {
      useMapStore.getState().setClickMode("default");
      useMapStore.getState().setPinDrop(null);
      useMapStore.getState().setNearbyFacilityIds([]);
      useMapStore.getState().setResultClickHandler(null);
    };
  }, []);

  const results = useMemo(() => {
    if (!pinDrop) return [];
    return facilities
      .filter((f) => selectedCategories.has(f.category))
      .map((f) => ({ ...f, distanceKm: haversineDistanceKm(pinDrop, f.position) }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 20);
  }, [pinDrop, selectedCategories]);

  useEffect(() => {
    useMapStore.getState().setNearbyFacilityIds(results.map((r) => r.id));
    useMapStore.getState().setResultClickHandler({
      kind: "facility",
      onSelect: (id) => {
        setSelectedId(id);
        rowRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
    });
  }, [results]);

  function toggleCategory(cat: FacilityCategory) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        useMapStore.getState().setPinDrop(p);
        useMapStore.getState().flyTo(p, 14);
      },
      () => {
        const fallback: [number, number] = [80.2707, 13.0827];
        useMapStore.getState().setPinDrop(fallback);
        useMapStore.getState().flyTo(fallback, 13);
      }
    );
  }

  return (
    <div className="px-1">
      <FlowHeader title="Nearby Facilities" subtitle="Drop a pin, search, or use your location" onClose={closeHomeFlow} />

      <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
        {CATEGORIES.map((c) => (
          <Chip key={c} selected={selectedCategories.has(c)} onClick={() => toggleCategory(c)}>
            {c === "Common Service Centre" ? "CSCs" : c + "s"}
          </Chip>
        ))}
      </div>

      {!pinDrop && (
        <div className="rounded-[var(--radius-card)] bg-white p-6 text-center">
          <MapPin size={22} color="#0066cc" className="mx-auto mb-2" />
          <p className="body-text font-medium text-[var(--color-ink)]">Tap anywhere on the map</p>
          <p className="caption-text mt-1 mb-4 text-[var(--color-muted)]">We'll find the closest facilities around that point.</p>
          <button
            className="mx-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-white active:scale-95"
            style={{ background: "#0066cc" }}
            onClick={useMyLocation}
          >
            <Crosshair size={15} />
            <span className="caption-text font-semibold">Use my location</span>
          </button>
        </div>
      )}

      {pinDrop && (
        <>
          <p className="caption-text mb-2 font-medium text-[var(--color-ink)]">{results.length} facilities found</p>
          {results.length === 0 && (
            <div className="rounded-[var(--radius-card)] bg-white p-6 text-center">
              <p className="caption-text text-[var(--color-muted)]">No facilities match the selected categories near this point.</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {results.map((f) => (
              <div
                key={f.id}
                ref={(el) => {
                  rowRefs.current[f.id] = el;
                }}
                onClick={() => {
                  setSelectedId(f.id);
                  useMapStore.getState().flyTo(f.position, 15.5);
                }}
                className="rounded-[var(--radius-card)] bg-white p-3.5"
                style={{ outline: selectedId === f.id ? "2px solid #0066cc" : "none" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="body-text truncate font-semibold text-[var(--color-ink)]">{f.name}</p>
                    <p className="caption-text truncate text-[var(--color-muted)]">{f.address}</p>
                  </div>
                  <span className="caption-text shrink-0 font-semibold" style={{ color: "#0066cc" }}>
                    {formatDistance(f.distanceKm)}
                  </span>
                </div>
                <span className="fine-text">{f.category}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
