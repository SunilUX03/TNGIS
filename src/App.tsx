import { useState } from "react";
import { MapCanvas } from "./components/map/MapCanvas";
import { MapControls } from "./components/map/MapControls";
import { Legend } from "./components/map/Legend";
import { MultiTapList } from "./components/map/MultiTapList";
import { TopBar } from "./components/layout/TopBar";
import { SearchBar } from "./components/search/SearchBar";
import { BottomTabBar } from "./components/layout/BottomTabBar";
import { BottomSheet, SHEET_HEIGHTS } from "./components/layout/BottomSheet";
import { LayerPanel } from "./components/layout/LayerPanel";
import { Toast } from "./components/shared/Toast";
import { ComingSoonPanel } from "./components/shared/ComingSoonPanel";
import { HomeTab } from "./components/home/HomeTab";
import { ResultSummaryCard } from "./components/search/ResultSummaryCard";
import { PlaceResultCard } from "./components/search/PlaceResultCard";
import { MultiResultList } from "./components/search/MultiResultList";
import { useNavStore } from "./store/useNavStore";
import type { SearchIndexEntry } from "./types";

function SheetContent() {
  const activeTab = useNavStore((s) => s.activeTab);
  const resultParcelId = useNavStore((s) => s.resultParcelId);
  const placeResultId = useNavStore((s) => s.placeResultId);

  if (resultParcelId) return <ResultSummaryCard parcelId={resultParcelId} />;
  if (placeResultId) return <PlaceResultCard placeId={placeResultId} />;

  switch (activeTab) {
    case "home":
      return <HomeTab />;
    case "analyze":
      return (
        <ComingSoonPanel
          title="Spatial Analysis"
          description="Guided near/buffer/along-route tools and the advanced query builder are coming in the next build."
        />
      );
    case "measure":
      return (
        <ComingSoonPanel
          title="Measure"
          description="Distance, area, perimeter and radius tools are coming in the next build."
        />
      );
    case "upload":
      return (
        <ComingSoonPanel
          title="Upload"
          description="Shapefile / KML / Excel upload and WMS/WFS connections are coming in the next build."
        />
      );
    default:
      return null;
  }
}

function App() {
  const [multiResults, setMultiResults] = useState<SearchIndexEntry[] | null>(null);
  const sheetSnap = useNavStore((s) => s.sheetSnap);
  const bottomOffset = SHEET_HEIGHTS[sheetSnap];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <TopBar />
      <div className="relative flex-1 overflow-hidden">
        <MapCanvas />
        <Toast />
        <SearchBar onMultiResults={setMultiResults} />
        <MapControls bottomOffset={bottomOffset} />
        <Legend leftOffset={12} bottomOffset={bottomOffset + 34} />
        <MultiTapList bottomOffset={bottomOffset + 12} />
        <BottomSheet>
          <SheetContent />
        </BottomSheet>
        {multiResults && <MultiResultList entries={multiResults} onClose={() => setMultiResults(null)} />}
        <LayerPanel />
      </div>
      <BottomTabBar />
    </div>
  );
}

export default App;
