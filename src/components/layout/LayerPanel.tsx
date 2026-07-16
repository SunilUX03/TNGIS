import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import clsx from "clsx";
import { useNavStore } from "../../store/useNavStore";
import { useLayerStore } from "../../store/useLayerStore";
import { layerCategories, totalLayerCount } from "../../data/layerCategories";
import type { LayerLeaf } from "../../types";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className="relative h-7 w-12 shrink-0 rounded-full transition-colors active:scale-95"
      style={{ background: on ? "#0066cc" : "var(--color-hairline)" }}
    >
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: on ? "translateX(21px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function LayerRow({ leaf }: { leaf: LayerLeaf }) {
  const on = useLayerStore((s) => !!s.on[leaf.id]);
  const loading = useLayerStore((s) => !!s.loading[leaf.id]);
  const opacity = useLayerStore((s) => s.opacity[leaf.id] ?? 80);
  const toggleLayer = useLayerStore((s) => s.toggleLayer);
  const setOpacity = useLayerStore((s) => s.setOpacity);

  return (
    <div className="border-b border-[var(--color-divider)] px-4 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <span className="caption-text flex-1 font-medium text-[var(--color-ink)]">{leaf.name}</span>
        <Toggle on={on} onChange={() => toggleLayer(leaf.id)} />
      </div>
      {on && loading && (
        <div className="mt-2 h-2 w-full animate-pulse rounded-full bg-[var(--color-divider)]" />
      )}
      {on && !loading && leaf.hasData && (
        <div className="mt-2 flex items-center gap-2">
          <span className="fine-text w-14 shrink-0">Opacity</span>
          <input
            type="range"
            min={10}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(leaf.id, Number(e.target.value))}
            className="h-1.5 flex-1 accent-[#0066cc]"
          />
          <span className="fine-text w-8 shrink-0 text-right">{opacity}%</span>
        </div>
      )}
      {on && !loading && !leaf.hasData && (
        <p className="fine-text mt-1.5 italic">No data available in this preview</p>
      )}
    </div>
  );
}

function CategorySection({
  id,
  name,
  layers,
  forceExpanded,
}: {
  id: string;
  name: string;
  layers: LayerLeaf[];
  forceExpanded: boolean;
}) {
  const storeExpanded = useLayerStore((s) => !!s.expandedCategories[id]);
  const expanded = forceExpanded || storeExpanded;
  const toggleCategory = useLayerStore((s) => s.toggleCategory);
  const on = useLayerStore((s) => s.on);
  const activeInCategory = layers.filter((l) => on[l.id]).length;

  return (
    <div className="border-b-8 border-[var(--color-parchment)]">
      <button
        className="flex w-full items-center justify-between px-4 py-3 active:bg-[var(--color-parchment)]"
        onClick={() => toggleCategory(id)}
      >
        <span className="flex items-center gap-2">
          <span className="body-text font-semibold text-[var(--color-ink)]">{name}</span>
          {activeInCategory > 0 && (
            <span
              className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 fine-text font-semibold text-white"
              style={{ background: "#0066cc" }}
            >
              {activeInCategory}
            </span>
          )}
        </span>
        <ChevronDown size={18} className={clsx("transition-transform", expanded && "rotate-180")} color="#7a7a7a" />
      </button>
      {expanded && <div>{layers.map((l) => <LayerRow key={l.id} leaf={l} />)}</div>}
    </div>
  );
}

export function LayerPanel() {
  const open = useNavStore((s) => s.layerPanelOpen);
  const setOpen = useNavStore((s) => s.setLayerPanelOpen);
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return layerCategories;
    return layerCategories
      .map((c) => ({ ...c, layers: c.layers.filter((l) => l.name.toLowerCase().includes(q)) }))
      .filter((c) => c.layers.length > 0);
  }, [query]);

  return (
    <>
      <div
        className={clsx(
          "absolute inset-0 z-40 bg-black/30 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <div
        className={clsx(
          "absolute inset-y-0 left-0 z-50 flex w-[86%] max-w-[360px] flex-col bg-white shadow-[var(--shadow-float)] transition-transform duration-250 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <div>
            <h2 className="text-[20px]">Map Layers</h2>
            <p className="fine-text">{totalLayerCount}+ layers across {layerCategories.length} categories</p>
          </div>
          <button aria-label="Close layer panel" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center active:scale-95">
            <X size={18} color="#7a7a7a" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-full bg-[var(--color-parchment)] px-4 py-2.5">
            <Search size={16} color="#7a7a7a" />
            <input
              className="caption-text flex-1 bg-transparent outline-none placeholder:text-[var(--color-muted)]"
              placeholder="Search layers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear layer search">
                <X size={14} color="#7a7a7a" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredCategories.length === 0 && (
            <p className="caption-text px-4 py-6 text-center text-[var(--color-muted)]">No layers match "{query}"</p>
          )}
          {filteredCategories.map((c) => (
            <CategorySection key={c.id} id={c.id} name={c.name} layers={c.layers} forceExpanded={!!query.trim()} />
          ))}
        </div>
      </div>
    </>
  );
}
