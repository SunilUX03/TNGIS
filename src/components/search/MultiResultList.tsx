import { Building2, LandPlot, MapPin, X } from "lucide-react";
import type { SearchIndexEntry } from "../../types";
import { navigateToEntry } from "./SearchBar";

function iconFor(type: SearchIndexEntry["type"]) {
  if (type === "parcel") return LandPlot;
  if (type === "village") return MapPin;
  return Building2;
}

export function MultiResultList({ entries, onClose }: { entries: SearchIndexEntry[]; onClose: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[104px] z-30 flex flex-col rounded-t-[var(--radius-card)] bg-white shadow-[var(--shadow-float)]">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="text-[20px]">{entries.length} results matched</h2>
        <button aria-label="Close results" onClick={onClose} className="flex h-9 w-9 items-center justify-center active:scale-95">
          <X size={18} color="#7a7a7a" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        {entries.map((e) => {
          const Icon = iconFor(e.type);
          return (
            <button
              key={e.id}
              className="mb-2 flex w-full items-center gap-3 rounded-[var(--radius-card)] p-3 text-left active:scale-[0.99]"
              style={{ background: "var(--color-parchment)" }}
              onClick={() => {
                navigateToEntry(e);
                onClose();
              }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                <Icon size={17} color="#0066cc" />
              </span>
              <span className="min-w-0 flex-1">
                <div className="body-text truncate font-medium text-[var(--color-ink)]">{e.label}</div>
                <div className="caption-text truncate text-[var(--color-muted)]">{e.sublabel}</div>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
