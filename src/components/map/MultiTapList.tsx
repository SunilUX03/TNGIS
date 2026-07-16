import { Layers } from "lucide-react";
import { useMapStore } from "../../store/useMapStore";
import { parcelById } from "../../data/parcels";
import { selectParcelAsResult } from "./MapCanvas";

export function MultiTapList({ bottomOffset }: { bottomOffset: number }) {
  const ids = useMapStore((s) => s.multiTapCandidateIds);
  if (ids.length === 0) return null;

  const candidates = ids.map((id) => parcelById(id)).filter(Boolean) as NonNullable<ReturnType<typeof parcelById>>[];

  return (
    <div
      className="absolute inset-x-3 z-20 rounded-[var(--radius-card)] bg-white p-3 shadow-[var(--shadow-float)]"
      style={{ bottom: bottomOffset }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Layers size={16} color="#0066cc" />
        <span className="body-text font-semibold">{candidates.length} parcels overlap here — pick one</span>
      </div>
      <div className="flex max-h-[220px] flex-col gap-1 overflow-y-auto no-scrollbar">
        {candidates.map((p) => (
          <button
            key={p.id}
            className="flex items-center justify-between rounded-[var(--radius-compact)] px-3 py-2.5 text-left active:scale-[0.98]"
            style={{ background: "var(--color-parchment)" }}
            onClick={() => {
              useMapStore.getState().setMultiTapCandidates([]);
              selectParcelAsResult(p.id);
            }}
          >
            <span className="caption-text font-medium">Survey No. {p.surveyNo}</span>
            <span className="fine-text">{p.classification}</span>
          </button>
        ))}
      </div>
      <button
        className="mt-2 w-full caption-text text-[var(--color-muted)]"
        onClick={() => useMapStore.getState().setMultiTapCandidates([])}
      >
        Cancel
      </button>
    </div>
  );
}
