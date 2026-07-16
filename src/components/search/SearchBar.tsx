import { useMemo, useRef, useState } from "react";
import { MapPin, Search, Building2, LandPlot, X } from "lucide-react";
import { searchMock } from "../../lib/search";
import type { SearchIndexEntry } from "../../types";
import { useMapStore } from "../../store/useMapStore";
import { useNavStore } from "../../store/useNavStore";
import { selectParcelAsResult } from "../map/MapCanvas";
import { villageBoundaries, districtBoundaries } from "../../data/boundaries";

function iconFor(type: SearchIndexEntry["type"]) {
  if (type === "parcel") return LandPlot;
  if (type === "village") return MapPin;
  return Building2;
}

export function navigateToEntry(entry: SearchIndexEntry) {
  const homeFlow = useNavStore.getState().homeFlow;

  if (homeFlow === "facilities") {
    useMapStore.getState().flyTo(entry.center, entry.zoom);
    useMapStore.getState().setPinDrop(entry.center);
    return;
  }

  if (entry.type === "parcel" && entry.parcelId) {
    if (homeFlow === "risk-check") {
      useMapStore.getState().setRiskParcelId(entry.parcelId);
      useMapStore.getState().flyTo(entry.center, 16.5);
      return;
    }
    selectParcelAsResult(entry.parcelId);
    return;
  }
  useMapStore.getState().flyTo(entry.center, entry.zoom);
  if (entry.type === "village") {
    const b = villageBoundaries.find((v) => v.id === "v-" + entry.id.replace("village-", ""));
    useMapStore.getState().setActiveAdminBoundaries(b ? [b.id] : []);
  } else if (entry.type === "district") {
    const b = districtBoundaries.find((d) => d.id === "d-" + entry.id.replace("district-", ""));
    useMapStore.getState().setActiveAdminBoundaries(b ? [b.id] : []);
  }
  useNavStore.getState().showPlace(entry.id);
}

export function SearchBar({ onMultiResults }: { onMultiResults: (entries: SearchIndexEntry[]) => void }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const results = useMemo(() => searchMock(query), [query]);

  function commit(entry: SearchIndexEntry) {
    setQuery(entry.label);
    setFocused(false);
    navigateToEntry(entry);
  }

  function handleSubmit() {
    const matches = searchMock(query, 6);
    if (matches.length === 0) {
      useNavStore.getState().showToast(`No results for "${query}"`);
      return;
    }
    if (matches.length === 1) {
      commit(matches[0]);
      return;
    }
    setFocused(false);
    onMultiResults(matches);
  }

  return (
    <div className="relative z-20 px-3 pb-2 pt-2 bg-white">
      <div className="flex items-center gap-2 rounded-full bg-[var(--color-parchment)] px-4 py-2.5">
        <Search size={18} color="#7a7a7a" />
        <input
          className="body-text flex-1 bg-transparent outline-none placeholder:text-[var(--color-muted)]"
          style={{ fontSize: 15 }}
          placeholder="Search survey no., village, or address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            blurTimeout.current = setTimeout(() => setFocused(false), 150);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              clearTimeout(blurTimeout.current);
              handleSubmit();
            }
          }}
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="flex h-6 w-6 items-center justify-center active:scale-95"
          >
            <X size={15} color="#7a7a7a" />
          </button>
        )}
      </div>

      {focused && query && (
        <div className="absolute inset-x-3 top-[52px] max-h-[320px] overflow-y-auto rounded-[var(--radius-card)] bg-white py-1.5 shadow-[var(--shadow-float)] no-scrollbar">
          {results.length === 0 && (
            <div className="px-4 py-3 caption-text text-[var(--color-muted)]">No matches yet — keep typing.</div>
          )}
          {results.map((r) => {
            const Icon = iconFor(r.type);
            return (
              <button
                key={r.id}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left active:bg-[var(--color-parchment)]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(r)}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-parchment)]">
                  <Icon size={15} color="#0066cc" />
                </span>
                <span className="min-w-0 flex-1">
                  <div className="caption-text truncate font-medium text-[var(--color-ink)]">{r.label}</div>
                  <div className="fine-text truncate">{r.sublabel}</div>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
