import { Locate, Minus, Plus } from "lucide-react";
import type { Map as MaplibreMap } from "maplibre-gl";
import { useMapStore } from "../../store/useMapStore";

function bumpZoom(delta: number) {
  const map = (window as any).__tngisMap as MaplibreMap | undefined;
  if (map) map.easeTo({ zoom: map.getZoom() + delta, duration: 250 });
}

function locateMe() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      useMapStore.getState().flyTo([pos.coords.longitude, pos.coords.latitude], 16);
      useMapStore.getState().setPinDrop([pos.coords.longitude, pos.coords.latitude]);
    },
    () => {
      // fall back to Chennai if permission denied — keeps the control usable in the demo
      useMapStore.getState().flyTo([80.2707, 13.0827], 13);
    }
  );
}

export function MapControls({ bottomOffset }: { bottomOffset: number }) {
  return (
    <div
      className="absolute right-3 z-10 flex flex-col gap-2 transition-[bottom] duration-200"
      style={{ bottom: bottomOffset + 12 }}
    >
      <div className="flex flex-col overflow-hidden rounded-[8px] bg-white shadow-[var(--shadow-float)]">
        <button
          aria-label="Zoom in"
          className="flex h-11 w-11 items-center justify-center active:scale-95 border-b border-[var(--color-divider)]"
          onClick={() => bumpZoom(1)}
        >
          <Plus size={18} color="#1d1d1f" />
        </button>
        <button
          aria-label="Zoom out"
          className="flex h-11 w-11 items-center justify-center active:scale-95"
          onClick={() => bumpZoom(-1)}
        >
          <Minus size={18} color="#1d1d1f" />
        </button>
      </div>
      <button
        aria-label="Locate me"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[var(--shadow-float)] active:scale-95"
        onClick={locateMe}
      >
        <Locate size={18} color="#0066cc" />
      </button>
    </div>
  );
}
