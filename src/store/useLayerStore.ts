import { create } from "zustand";
import { layerCategories } from "../data/layerCategories";

interface LayerState {
  on: Record<string, boolean>;
  opacity: Record<string, number>;
  loading: Record<string, boolean>;
  expandedCategories: Record<string, boolean>;
  panelQuery: string;

  toggleLayer: (id: string) => void;
  setOpacity: (id: string, value: number) => void;
  toggleCategory: (id: string) => void;
  setPanelQuery: (q: string) => void;
  activeCount: () => number;
}

const initialExpanded: Record<string, boolean> = {};
layerCategories.forEach((c, i) => {
  initialExpanded[c.id] = i === 0;
});

export const useLayerStore = create<LayerState>((set, get) => ({
  on: {},
  opacity: {},
  loading: {},
  expandedCategories: initialExpanded,
  panelQuery: "",

  toggleLayer: (id) => {
    const willTurnOn = !get().on[id];
    set((s) => ({ on: { ...s.on, [id]: willTurnOn }, opacity: { [id]: 80, ...s.opacity } }));
    if (willTurnOn) {
      set((s) => ({ loading: { ...s.loading, [id]: true } }));
      setTimeout(() => {
        set((s) => ({ loading: { ...s.loading, [id]: false } }));
      }, 500 + Math.random() * 400);
    }
  },
  setOpacity: (id, value) => set((s) => ({ opacity: { ...s.opacity, [id]: value } })),
  toggleCategory: (id) =>
    set((s) => ({ expandedCategories: { ...s.expandedCategories, [id]: !s.expandedCategories[id] } })),
  setPanelQuery: (q) => set({ panelQuery: q }),
  activeCount: () => Object.values(get().on).filter(Boolean).length,
}));
