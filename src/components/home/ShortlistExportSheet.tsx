import { Download, Share2, Trash2, X } from "lucide-react";
import { useShortlistStore } from "../../store/useShortlistStore";
import { parcelsFromIds } from "./FindVacantLandFlow";
import { formatAcres, formatGlv } from "../../lib/format";
import { useNavStore } from "../../store/useNavStore";

export function ShortlistExportSheet({ onClose }: { onClose: () => void }) {
  const ids = useShortlistStore((s) => s.parcelIds);
  const remove = useShortlistStore((s) => s.remove);
  const clear = useShortlistStore((s) => s.clear);
  const showToast = useNavStore((s) => s.showToast);
  const parcels = parcelsFromIds(ids);

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 max-h-[80%] rounded-t-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-float)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[20px]">Shortlist Summary</h2>
          <button aria-label="Close" onClick={onClose} className="flex h-9 w-9 items-center justify-center active:scale-95">
            <X size={18} color="#7a7a7a" />
          </button>
        </div>
        <div className="max-h-[45vh] overflow-y-auto no-scrollbar">
          {parcels.map((p) => (
            <div key={p.id} className="flex items-center justify-between border-b border-[var(--color-divider)] py-2.5">
              <div>
                <p className="caption-text font-semibold text-[var(--color-ink)]">Survey No. {p.surveyNo}</p>
                <p className="fine-text">
                  {p.villageName}, {p.districtName} · {formatAcres(p.areaAcres)} · {formatGlv(p.glvPerSqft)}
                </p>
              </div>
              <button onClick={() => remove(p.id)} aria-label="Remove from shortlist" className="active:scale-95">
                <Trash2 size={16} color="#c41e3a" />
              </button>
            </div>
          ))}
          {parcels.length === 0 && <p className="caption-text py-6 text-center text-[var(--color-muted)]">Shortlist is empty.</p>}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-white active:scale-[0.98]"
            style={{ background: "#0066cc" }}
            onClick={() => showToast(`Exported shortlist (${parcels.length} parcels) as PDF summary`)}
          >
            <Download size={16} />
            <span className="caption-text font-semibold">Export as PDF</span>
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 active:scale-[0.98]"
            style={{ background: "var(--color-parchment)" }}
            onClick={() => showToast("Shareable link copied to clipboard")}
          >
            <Share2 size={16} color="#1d1d1f" />
            <span className="caption-text font-semibold text-[var(--color-ink)]">Share</span>
          </button>
        </div>
        {parcels.length > 0 && (
          <button className="mt-3 w-full caption-text text-[var(--color-danger)]" onClick={clear}>
            Clear shortlist
          </button>
        )}
      </div>
    </div>
  );
}
