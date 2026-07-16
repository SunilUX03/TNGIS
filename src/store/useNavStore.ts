import { create } from "zustand";

export type TabId = "home" | "analyze" | "measure" | "upload";
export type HomeFlow = "vacant-land" | "risk-check" | "area-lookup" | "facilities" | null;
export type SheetSnap = "peek" | "half" | "full";

interface NavState {
  activeTab: TabId;
  homeFlow: HomeFlow;
  layerPanelOpen: boolean;
  sheetSnap: SheetSnap;
  resultParcelId: string | null; // drives the search Result Summary Card, shown over any tab
  placeResultId: string | null; // village/district search result (id from searchIndex, e.g. "village-adyar")
  toast: string | null;

  setActiveTab: (tab: TabId) => void;
  openHomeFlow: (flow: HomeFlow) => void;
  closeHomeFlow: () => void;
  setLayerPanelOpen: (open: boolean) => void;
  setSheetSnap: (snap: SheetSnap) => void;
  showResult: (parcelId: string) => void;
  showPlace: (id: string) => void;
  clearResult: () => void;
  showToast: (message: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useNavStore = create<NavState>((set) => ({
  activeTab: "home",
  homeFlow: null,
  layerPanelOpen: false,
  sheetSnap: "peek",
  resultParcelId: null,
  placeResultId: null,
  toast: null,

  setActiveTab: (tab) =>
    set({ activeTab: tab, homeFlow: null, resultParcelId: null, placeResultId: null, sheetSnap: "half" }),
  openHomeFlow: (flow) => set({ homeFlow: flow, resultParcelId: null, placeResultId: null, sheetSnap: "half" }),
  closeHomeFlow: () => set({ homeFlow: null, sheetSnap: "peek" }),
  setLayerPanelOpen: (open) => set({ layerPanelOpen: open }),
  setSheetSnap: (snap) => set({ sheetSnap: snap }),
  showResult: (parcelId) =>
    set({ resultParcelId: parcelId, placeResultId: null, homeFlow: null, sheetSnap: "half" }),
  showPlace: (id) => set({ placeResultId: id, resultParcelId: null, homeFlow: null, sheetSnap: "half" }),
  clearResult: () => set({ resultParcelId: null, placeResultId: null }),
  showToast: (message) => {
    clearTimeout(toastTimer);
    set({ toast: message });
    toastTimer = setTimeout(() => set({ toast: null }), 2600);
  },
}));
