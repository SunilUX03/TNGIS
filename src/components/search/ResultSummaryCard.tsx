import { Ruler, SlidersHorizontal, Share2, X } from "lucide-react";
import { parcelById } from "../../data/parcels";
import { ClassificationBadge } from "../shared/StatusBadge";
import { DataAsOfTag } from "../shared/DataAsOfTag";
import { formatAreaBoth, formatGlv } from "../../lib/format";
import { useNavStore } from "../../store/useNavStore";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="caption-text text-[var(--color-muted)]">{label}</span>
      <span className="caption-text font-medium text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

export function ResultSummaryCard({ parcelId }: { parcelId: string }) {
  const parcel = parcelById(parcelId);
  const setActiveTab = useNavStore((s) => s.setActiveTab);
  const clearResult = useNavStore((s) => s.clearResult);
  const showToast = useNavStore((s) => s.showToast);

  if (!parcel) return null;

  return (
    <div className="px-1">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h2 className="text-[20px]">Survey No. {parcel.surveyNo}</h2>
          <p className="caption-text text-[var(--color-muted)]">
            {parcel.villageName}, {parcel.taluketName}, {parcel.districtName}
          </p>
        </div>
        <button aria-label="Close result" onClick={clearResult} className="flex h-9 w-9 items-center justify-center active:scale-95">
          <X size={18} color="#7a7a7a" />
        </button>
      </div>

      <ClassificationBadge classification={parcel.classification} />

      <div className="mt-3 divide-y divide-[var(--color-divider)] rounded-[var(--radius-card)] bg-white px-4">
        <Row label="Panchayat / Ward" value={parcel.panchayatOrWard} />
        <Row label="Assembly Constituency" value={parcel.assemblyConstituency} />
        <Row label="Parliament Constituency" value={parcel.parliamentConstituency} />
        <Row label="Area" value={formatAreaBoth(parcel.areaAcres)} />
        <Row label="Land Guideline Value" value={formatGlv(parcel.glvPerSqft)} />
        <Row label="Distance to Highway" value={`${parcel.distanceToHighwayKm.toFixed(1)} km`} />
      </div>

      <div className="mt-2">
        <DataAsOfTag date={parcel.dataAsOf} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          className="flex flex-col items-center gap-1 rounded-[var(--radius-compact)] py-2.5 active:scale-95"
          style={{ background: "#ffffff" }}
          onClick={() => setActiveTab("measure")}
        >
          <Ruler size={17} color="#0066cc" />
          <span className="fine-text font-medium text-[var(--color-ink)]">Measure This</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 rounded-[var(--radius-compact)] py-2.5 active:scale-95"
          style={{ background: "#ffffff" }}
          onClick={() => setActiveTab("analyze")}
        >
          <SlidersHorizontal size={17} color="#0066cc" />
          <span className="fine-text font-medium text-[var(--color-ink)]">Analyze This</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 rounded-[var(--radius-compact)] py-2.5 active:scale-95"
          style={{ background: "#ffffff" }}
          onClick={() => showToast("Shareable summary copied to clipboard")}
        >
          <Share2 size={17} color="#0066cc" />
          <span className="fine-text font-medium text-[var(--color-ink)]">Share</span>
        </button>
      </div>
    </div>
  );
}
