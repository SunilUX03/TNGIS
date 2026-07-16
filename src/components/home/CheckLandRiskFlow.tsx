import { useEffect } from "react";
import { MapPin } from "lucide-react";
import { FlowHeader } from "../shared/FlowHeader";
import { RiskStatusBadge } from "../shared/StatusBadge";
import { DataAsOfTag } from "../shared/DataAsOfTag";
import { useNavStore } from "../../store/useNavStore";
import { useMapStore } from "../../store/useMapStore";
import { parcelById } from "../../data/parcels";
import type { OverlapFlags } from "../../types";

const ZONE_META: { key: keyof OverlapFlags; label: string; explanation: string }[] = [
  {
    key: "crz",
    label: "Coastal Regulation Zone (CRZ)",
    explanation: "This parcel falls within a Coastal Regulation Zone buffer — construction may require additional clearance from the Coastal Zone Management Authority.",
  },
  {
    key: "reserveForest",
    label: "Reserve Forest",
    explanation: "This parcel is adjacent to or within a Reserve Forest boundary — any land-use change may require Forest Department clearance.",
  },
  {
    key: "floodZone",
    label: "Flood Inundation Area",
    explanation: "This parcel lies within a known flood-prone delta zone — factor in monsoon-season flood risk before building.",
  },
  {
    key: "ecoSensitive",
    label: "Eco Sensitive Zone",
    explanation: "This parcel falls within an Eco-Sensitive Zone buffer — construction is regulated under the Environment Protection Act.",
  },
];

export function CheckLandRiskFlow() {
  const closeHomeFlow = useNavStore((s) => s.closeHomeFlow);
  const riskParcelId = useMapStore((s) => s.riskParcelId);
  const parcel = riskParcelId ? parcelById(riskParcelId) : null;

  useEffect(() => {
    useMapStore.getState().setClickMode("risk-select");
    return () => {
      useMapStore.getState().setClickMode("default");
      useMapStore.getState().setRiskParcelId(null);
      useMapStore.getState().clearHighlight();
    };
  }, []);

  useEffect(() => {
    if (riskParcelId) useMapStore.getState().setHighlight([riskParcelId]);
  }, [riskParcelId]);

  if (!parcel) {
    return (
      <div className="px-1">
        <FlowHeader title="Check Land Risk" subtitle="Select a parcel to check" onClose={closeHomeFlow} />
        <div className="rounded-[var(--radius-card)] bg-white p-6 text-center">
          <MapPin size={22} color="#0066cc" className="mx-auto mb-2" />
          <p className="body-text font-medium text-[var(--color-ink)]">Tap a parcel on the map</p>
          <p className="caption-text mt-1 text-[var(--color-muted)]">
            Or search for a survey number or village using the search bar above.
          </p>
        </div>
      </div>
    );
  }

  const anyRisk = ZONE_META.some((z) => parcel.overlaps[z.key]);

  return (
    <div className="px-1">
      <FlowHeader
        title="Check Land Risk"
        subtitle={`Survey No. ${parcel.surveyNo} · ${parcel.villageName}`}
        onBack={() => useMapStore.getState().setRiskParcelId(null)}
        onClose={closeHomeFlow}
      />
      <div
        className="mb-3 rounded-[var(--radius-card)] p-3.5"
        style={{ background: anyRisk ? "rgba(185,80,0,0.08)" : "rgba(26,127,55,0.08)" }}
      >
        <p className="caption-text font-semibold" style={{ color: anyRisk ? "var(--color-warning)" : "var(--color-success)" }}>
          {anyRisk ? "This parcel overlaps one or more restricted zones" : "No restricted-zone overlaps detected"}
        </p>
      </div>

      <div className="divide-y divide-[var(--color-divider)] rounded-[var(--radius-card)] bg-white px-4">
        {ZONE_META.map((z) => (
          <div key={z.key} className="py-3">
            <div className="flex items-center justify-between">
              <span className="caption-text font-medium text-[var(--color-ink)]">{z.label}</span>
              <RiskStatusBadge affected={parcel.overlaps[z.key]} />
            </div>
            {parcel.overlaps[z.key] && <p className="caption-text mt-1.5 text-[var(--color-secondary)]">{z.explanation}</p>}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <DataAsOfTag date={parcel.dataAsOf} />
      </div>
    </div>
  );
}
