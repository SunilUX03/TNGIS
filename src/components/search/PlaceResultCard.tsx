import { X, LandPlot } from "lucide-react";
import { villages, districts, taluksByDistrict } from "../../data/geography";
import { useNavStore } from "../../store/useNavStore";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="caption-text text-[var(--color-muted)]">{label}</span>
      <span className="caption-text font-medium text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

export function PlaceResultCard({ placeId }: { placeId: string }) {
  const clearResult = useNavStore((s) => s.clearResult);
  const setActiveTab = useNavStore((s) => s.setActiveTab);
  const openHomeFlow = useNavStore((s) => s.openHomeFlow);

  if (placeId.startsWith("village-")) {
    const village = villages.find((v) => v.id === placeId.replace("village-", ""));
    if (!village) return null;
    return (
      <div className="px-1">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className="text-[20px]">{village.name}</h2>
            <p className="caption-text text-[var(--color-muted)]">
              {village.taluketName}, {village.taluketDistrictName}
            </p>
          </div>
          <button aria-label="Close result" onClick={clearResult} className="flex h-9 w-9 items-center justify-center active:scale-95">
            <X size={18} color="#7a7a7a" />
          </button>
        </div>
        <div className="divide-y divide-[var(--color-divider)] rounded-[var(--radius-card)] bg-white px-4">
          <Row label="Panchayat / Ward" value={village.panchayatOrWard} />
          <Row label="Assembly Constituency" value={village.taluketAssembly ?? "—"} />
          <Row label="Parliament Constituency" value={village.taluketParliament ?? "—"} />
        </div>
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-white active:scale-[0.98]"
          style={{ background: "#0066cc" }}
          onClick={() => {
            setActiveTab("home");
            openHomeFlow("vacant-land");
          }}
        >
          <LandPlot size={16} />
          <span className="caption-text font-medium">Find vacant land nearby</span>
        </button>
      </div>
    );
  }

  const district = districts.find((d) => d.id === placeId.replace("district-", ""));
  if (!district) return null;
  const talukCount = taluksByDistrict(district.id).length;
  return (
    <div className="px-1">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h2 className="text-[20px]">{district.name} District</h2>
          <p className="caption-text text-[var(--color-muted)]">{talukCount} taluks covered in this preview</p>
        </div>
        <button aria-label="Close result" onClick={clearResult} className="flex h-9 w-9 items-center justify-center active:scale-95">
          <X size={18} color="#7a7a7a" />
        </button>
      </div>
      <button
        className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-white active:scale-[0.98]"
        style={{ background: "#0066cc" }}
        onClick={() => {
          setActiveTab("home");
          openHomeFlow("vacant-land");
        }}
      >
        <LandPlot size={16} />
        <span className="caption-text font-medium">Find vacant land in {district.name}</span>
      </button>
    </div>
  );
}
