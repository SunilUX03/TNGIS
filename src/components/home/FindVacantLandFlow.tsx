import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, ChevronRight, ClipboardList, MapPin } from "lucide-react";
import { FlowHeader } from "../shared/FlowHeader";
import { Chip } from "../shared/Chip";
import { SkeletonRow } from "../shared/Skeleton";
import { useNavStore } from "../../store/useNavStore";
import { useMapStore } from "../../store/useMapStore";
import { useShortlistStore } from "../../store/useShortlistStore";
import { districts } from "../../data/geography";
import { vacantParcels, parcelById } from "../../data/parcels";
import type { Parcel } from "../../types";
import { formatAcres } from "../../lib/format";
import { ShortlistExportSheet } from "./ShortlistExportSheet";

type SizeBucket = "any" | "small" | "mid" | "large";
const SIZE_OPTIONS: { id: SizeBucket; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "small", label: "3-5 Acres" },
  { id: "mid", label: "5-50 Acres" },
  { id: "large", label: "50+ Acres" },
];

function matchesBucket(area: number, bucket: SizeBucket) {
  if (bucket === "any") return true;
  if (bucket === "small") return area >= 3 && area < 5;
  if (bucket === "mid") return area >= 5 && area < 50;
  return area >= 50;
}

export function FindVacantLandFlow() {
  const closeHomeFlow = useNavStore((s) => s.closeHomeFlow);
  const [step, setStep] = useState<"district" | "size" | "results">("district");
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [bucket, setBucket] = useState<SizeBucket>("any");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const shortlist = useShortlistStore((s) => s.parcelIds);
  const addShortlist = useShortlistStore((s) => s.add);
  const removeShortlist = useShortlistStore((s) => s.remove);

  const results: Parcel[] = useMemo(() => {
    if (step !== "results" || !districtId) return [];
    return vacantParcels().filter((p) => p.districtId === districtId && matchesBucket(p.areaAcres, bucket));
  }, [step, districtId, bucket]);

  useEffect(() => {
    if (step !== "results") return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, [step, districtId, bucket]);

  useEffect(() => {
    if (step !== "results") return;
    useMapStore.getState().setResultParcels(results.map((p) => p.id));
    useMapStore.getState().setResultClickHandler({
      kind: "parcel",
      onSelect: (id) => {
        setSelectedId(id);
        rowRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
    });
    if (results.length > 0) {
      const first = results[0];
      useMapStore.getState().flyTo(first.center, results.length === 1 ? 15.5 : 11.5);
    }
    return () => {
      useMapStore.getState().setResultParcels([]);
      useMapStore.getState().setResultClickHandler(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, results]);

  useEffect(() => {
    return () => {
      useMapStore.getState().setResultParcels([]);
      useMapStore.getState().setResultClickHandler(null);
      useMapStore.getState().clearHighlight();
    };
  }, []);

  function selectRow(p: Parcel) {
    setSelectedId(p.id);
    useMapStore.getState().setHighlight([p.id]);
    useMapStore.getState().flyTo(p.center, 16);
  }

  if (step === "district") {
    return (
      <div className="px-1">
        <FlowHeader title="Find Vacant Land" subtitle="Step 1 of 2 — Choose a district" onClose={closeHomeFlow} />
        <div className="flex flex-col gap-2">
          {districts.map((d) => (
            <button
              key={d.id}
              className="flex items-center justify-between rounded-[var(--radius-card)] bg-white px-4 py-3.5 active:scale-[0.99]"
              onClick={() => {
                setDistrictId(d.id);
                setStep("size");
              }}
            >
              <span className="body-text font-medium text-[var(--color-ink)]">{d.name}</span>
              <ChevronRight size={18} color="#7a7a7a" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "size") {
    return (
      <div className="px-1">
        <FlowHeader
          title="Find Vacant Land"
          subtitle="Step 2 of 2 — Minimum land size"
          onBack={() => setStep("district")}
          onClose={closeHomeFlow}
        />
        <div className="flex flex-wrap gap-2 mb-5">
          {SIZE_OPTIONS.map((o) => (
            <Chip key={o.id} selected={bucket === o.id} onClick={() => setBucket(o.id)}>
              {o.label}
            </Chip>
          ))}
        </div>
        <p className="caption-text mb-2 font-medium text-[var(--color-ink)]">Automatically excluded</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {["Agricultural land", "Forest", "Water Bodies"].map((x) => (
            <Chip key={x} disabled>
              {x}
            </Chip>
          ))}
        </div>
        <button
          className="w-full rounded-full py-3 text-white active:scale-[0.98]"
          style={{ background: "#0066cc" }}
          onClick={() => setStep("results")}
        >
          <span className="body-text font-semibold">Search Vacant Land</span>
        </button>
      </div>
    );
  }

  const district = districts.find((d) => d.id === districtId);

  return (
    <div className="px-1">
      <FlowHeader
        title="Find Vacant Land"
        subtitle={`${district?.name} · ${SIZE_OPTIONS.find((o) => o.id === bucket)?.label}`}
        onBack={() => setStep("size")}
        onClose={closeHomeFlow}
      />

      {loading ? (
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="caption-text font-medium text-[var(--color-ink)]">{results.length} parcels matched</p>
            {shortlist.length > 0 && (
              <button
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{ background: "rgba(0,102,204,0.1)" }}
                onClick={() => setExportOpen(true)}
              >
                <ClipboardList size={14} color="#0066cc" />
                <span className="fine-text font-semibold" style={{ color: "#0066cc" }}>
                  Shortlist ({shortlist.length})
                </span>
              </button>
            )}
          </div>

          {results.length === 0 && (
            <div className="rounded-[var(--radius-card)] bg-white p-6 text-center">
              <MapPin size={22} color="#7a7a7a" className="mx-auto mb-2" />
              <p className="body-text font-medium text-[var(--color-ink)]">No matching parcels</p>
              <p className="caption-text mt-1 text-[var(--color-muted)]">
                Try a different size range or district — {district?.name} has no vacant parcels in this bucket right now.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {results.map((p) => {
              const inShortlist = shortlist.includes(p.id);
              return (
                <div
                  key={p.id}
                  ref={(el) => {
                    rowRefs.current[p.id] = el;
                  }}
                  onClick={() => selectRow(p)}
                  className="rounded-[var(--radius-card)] bg-white p-3.5 transition-shadow"
                  style={{ outline: selectedId === p.id ? "2px solid #0066cc" : "none" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="body-text font-semibold text-[var(--color-ink)]">Survey No. {p.surveyNo}</p>
                      <p className="caption-text text-[var(--color-muted)]">
                        {p.villageName}, {p.taluketName}
                      </p>
                    </div>
                    <span className="caption-text font-semibold" style={{ color: "#0066cc" }}>
                      {formatAcres(p.areaAcres)}
                    </span>
                  </div>
                  <p className="fine-text mt-1">{p.distanceToHighwayKm.toFixed(1)} km from nearest highway</p>
                  <div className="mt-2.5 flex gap-2">
                    <button
                      className="flex-1 rounded-full py-2 caption-text font-medium active:scale-95"
                      style={{ background: "var(--color-parchment)", color: "var(--color-ink)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        useNavStore.getState().showResult(p.id);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 caption-text font-medium active:scale-95"
                      style={{
                        background: inShortlist ? "rgba(26,127,55,0.12)" : "rgba(0,102,204,0.1)",
                        color: inShortlist ? "var(--color-success)" : "#0066cc",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        inShortlist ? removeShortlist(p.id) : addShortlist(p.id);
                      }}
                    >
                      {inShortlist ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                      {inShortlist ? "Shortlisted" : "Add to Shortlist"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {exportOpen && <ShortlistExportSheet onClose={() => setExportOpen(false)} />}
    </div>
  );
}

export function parcelsFromIds(ids: string[]) {
  return ids.map((id) => parcelById(id)).filter(Boolean) as Parcel[];
}
