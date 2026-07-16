import { create } from "zustand";

interface ShortlistState {
  parcelIds: string[];
  exportOpen: boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setExportOpen: (open: boolean) => void;
}

export const useShortlistStore = create<ShortlistState>((set) => ({
  parcelIds: [],
  exportOpen: false,
  add: (id) => set((s) => (s.parcelIds.includes(id) ? s : { parcelIds: [...s.parcelIds, id] })),
  remove: (id) => set((s) => ({ parcelIds: s.parcelIds.filter((p) => p !== id) })),
  clear: () => set({ parcelIds: [] }),
  setExportOpen: (open) => set({ exportOpen: open }),
}));
