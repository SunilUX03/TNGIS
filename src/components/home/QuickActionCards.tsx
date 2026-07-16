import { LandPlot, ShieldAlert, MapPinned, Building } from "lucide-react";
import { useNavStore, type HomeFlow } from "../../store/useNavStore";

const CARDS: { id: HomeFlow; title: string; subtitle: string; icon: typeof LandPlot }[] = [
  { id: "vacant-land", title: "Find Vacant Land", subtitle: "Browse government land by size & district", icon: LandPlot },
  { id: "risk-check", title: "Check Land Risk", subtitle: "CRZ, forest, flood & eco-sensitive overlap", icon: ShieldAlert },
  { id: "area-lookup", title: "What Area Am I In?", subtitle: "Village, ward & constituency lookup", icon: MapPinned },
  { id: "facilities", title: "Nearby Facilities", subtitle: "Schools, hospitals, offices & more", icon: Building },
];

export function QuickActionCards() {
  const openHomeFlow = useNavStore((s) => s.openHomeFlow);

  return (
    <div>
      <h2 className="text-[24px] mb-1">Welcome to TNGIS</h2>
      <p className="body-text text-[var(--color-muted)] mb-4">What would you like to do today?</p>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => openHomeFlow(c.id)}
              className="flex w-[168px] shrink-0 flex-col items-start gap-3 rounded-[var(--radius-card)] bg-white p-4 text-left active:scale-[0.97]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(0,102,204,0.1)" }}>
                <Icon size={19} color="#0066cc" />
              </span>
              <span>
                <div className="body-text font-semibold leading-tight text-[var(--color-ink)]">{c.title}</div>
                <div className="fine-text mt-1">{c.subtitle}</div>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
