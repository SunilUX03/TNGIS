import { useEffect, useMemo } from "react";
import { Crosshair, MapPin } from "lucide-react";
import { FlowHeader } from "../shared/FlowHeader";
import { useNavStore } from "../../store/useNavStore";
import { useMapStore } from "../../store/useMapStore";
import { villages } from "../../data/geography";
import { villageBoundaries, wardBoundaries, assemblyForName } from "../../data/boundaries";
import { haversineDistanceKm } from "../../lib/geo";
import type { AdminLevel } from "../../types";

const LEVELS: { id: AdminLevel; label: string }[] = [
  { id: "village", label: "Village" },
  { id: "ward", label: "Ward" },
  { id: "constituency", label: "Constituency" },
];

function nearestVillage(pos: [number, number]) {
  let best = villages[0];
  let bestDist = Infinity;
  for (const v of villages) {
    const d = haversineDistanceKm(pos, v.center);
    if (d < bestDist) {
      bestDist = d;
      best = v;
    }
  }
  return best;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="caption-text text-[var(--color-muted)]">{label}</span>
      <span className="caption-text font-medium text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

export function WhatAreaAmIInFlow() {
  const closeHomeFlow = useNavStore((s) => s.closeHomeFlow);
  const pinDrop = useMapStore((s) => s.pinDrop);
  const activeLevel = useMapStore((s) => s.activeAdminLevel);
  const setActiveLevel = useMapStore((s) => s.setActiveAdminLevel);

  useEffect(() => {
    useMapStore.getState().setClickMode("area-lookup");
    return () => {
      useMapStore.getState().setClickMode("default");
      useMapStore.getState().setPinDrop(null);
      useMapStore.getState().setActiveAdminBoundaries([]);
    };
  }, []);

  const village = useMemo(() => (pinDrop ? nearestVillage(pinDrop) : null), [pinDrop]);

  useEffect(() => {
    if (!village) return;
    if (activeLevel === "village") {
      const b = villageBoundaries.find((b) => b.id === "v-" + village.id);
      useMapStore.getState().setActiveAdminBoundaries(b ? [b.id] : []);
    } else if (activeLevel === "ward") {
      const b = wardBoundaries.find((b) => b.id === "w-" + village.id);
      useMapStore.getState().setActiveAdminBoundaries(b ? [b.id] : []);
    } else {
      const b = assemblyForName(village.taluketAssembly ?? "");
      useMapStore.getState().setActiveAdminBoundaries(b ? [b.id] : []);
    }
  }, [village, activeLevel]);

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        useMapStore.getState().setPinDrop(p);
        useMapStore.getState().flyTo(p, 15.5);
      },
      () => {
        const fallback: [number, number] = [80.2707, 13.0827];
        useMapStore.getState().setPinDrop(fallback);
        useMapStore.getState().flyTo(fallback, 13);
      }
    );
  }

  const hasWard = village ? !!wardBoundaries.find((b) => b.id === "w-" + village.id) : false;

  return (
    <div className="px-1">
      <FlowHeader title="What Area Am I In?" subtitle="Drop a pin or use your location" onClose={closeHomeFlow} />

      {!village && (
        <div className="rounded-[var(--radius-card)] bg-white p-6 text-center">
          <MapPin size={22} color="#0066cc" className="mx-auto mb-2" />
          <p className="body-text font-medium text-[var(--color-ink)]">Tap anywhere on the map</p>
          <p className="caption-text mt-1 mb-4 text-[var(--color-muted)]">Or let us use your current location.</p>
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

      {village && (
        <>
          <div className="mb-3 flex gap-1.5 rounded-full bg-white p-1">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLevel(l.id)}
                className="flex-1 rounded-full py-2 caption-text font-medium transition-colors active:scale-95"
                style={{
                  background: activeLevel === l.id ? "#0066cc" : "transparent",
                  color: activeLevel === l.id ? "#ffffff" : "var(--color-ink)",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {activeLevel === "ward" && !hasWard && (
            <p className="fine-text mb-2 italic">No ward data available for this location in this preview — showing village instead.</p>
          )}

          <div className="divide-y divide-[var(--color-divider)] rounded-[var(--radius-card)] bg-white px-4">
            <Row label="Village" value={village.name} />
            <Row label="Panchayat / Ward" value={village.panchayatOrWard} />
            <Row label="Taluk" value={village.taluketName ?? "—"} />
            <Row label="District" value={village.taluketDistrictName ?? "—"} />
            <Row label="Assembly Constituency" value={village.taluketAssembly ?? "—"} />
            <Row label="Parliament Constituency" value={village.taluketParliament ?? "—"} />
          </div>

          <button
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 active:scale-[0.98]"
            style={{ background: "white" }}
            onClick={useMyLocation}
          >
            <Crosshair size={14} color="#0066cc" />
            <span className="caption-text font-medium" style={{ color: "#0066cc" }}>
              Use my current location instead
            </span>
          </button>
        </>
      )}
    </div>
  );
}
