import { useEffect, useMemo, useState } from "react";
import { X, ChevronUp } from "lucide-react";
import { useLayerStore } from "../../store/useLayerStore";
import { layerCategories } from "../../data/layerCategories";
import { CLASSIFICATION_COLOR, ENV_COLOR, ENV_LABEL } from "../../lib/mapColors";

interface LegendEntry {
  id: string;
  name: string;
  color: string;
}

function buildLegendEntries(on: Record<string, boolean>): LegendEntry[] {
  const entries: LegendEntry[] = [];
  const activeLeaves = layerCategories.flatMap((c) => c.layers).filter((l) => on[l.id] && l.hasData);

  for (const leaf of activeLeaves) {
    const ref = leaf.dataRef;
    if (!ref) continue;
    if (ref.kind === "parcels" && ref.filter) {
      entries.push({ id: leaf.id, name: leaf.name, color: CLASSIFICATION_COLOR[ref.filter as keyof typeof CLASSIFICATION_COLOR] ?? "#999" });
    } else if (ref.kind === "parcels" && !ref.filter) {
      entries.push({ id: leaf.id, name: "Survey Parcels (all classes)", color: "#0066cc" });
    } else if (ref.kind === "env" && ref.filter) {
      const type = ref.filter as keyof typeof ENV_COLOR;
      entries.push({ id: leaf.id, name: ENV_LABEL[type], color: ENV_COLOR[type] });
    } else if (ref.kind === "boundary") {
      entries.push({ id: leaf.id, name: leaf.name, color: "#0066cc" });
    } else if (ref.kind === "road" || ref.kind === "rail") {
      entries.push({ id: leaf.id, name: leaf.name, color: "#5a5a5a" });
    } else if (ref.kind === "facility") {
      entries.push({ id: leaf.id, name: leaf.name, color: "#0066cc" });
    }
  }
  return entries;
}

export function Legend({ leftOffset, bottomOffset }: { leftOffset: number; bottomOffset: number }) {
  const on = useLayerStore((s) => s.on);
  const [dismissed, setDismissed] = useState(false);
  const entries = useMemo(() => buildLegendEntries(on), [on]);
  const signature = entries.map((e) => e.id).join(",");

  useEffect(() => {
    setDismissed(false);
  }, [signature]);

  if (entries.length === 0) return null;

  if (dismissed) {
    return (
      <button
        className="absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[var(--shadow-float)] active:scale-95"
        style={{ left: leftOffset, bottom: bottomOffset }}
        onClick={() => setDismissed(false)}
        aria-label="Show legend"
      >
        <ChevronUp size={16} color="#1d1d1f" />
      </button>
    );
  }

  return (
    <div
      className="absolute z-10 max-w-[220px] rounded-[var(--radius-card)] bg-white/95 p-3 shadow-[var(--shadow-float)]"
      style={{ left: leftOffset, bottom: bottomOffset }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="caption-text font-semibold text-[var(--color-ink)]">Legend</span>
        <button aria-label="Dismiss legend" onClick={() => setDismissed(true)} className="text-[var(--color-muted)] active:scale-95">
          <X size={14} />
        </button>
      </div>
      <div className="flex max-h-[160px] flex-col gap-1 overflow-y-auto no-scrollbar">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: e.color }} />
            <span className="fine-text truncate text-[var(--color-secondary)]">{e.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
