import { Home, SlidersHorizontal, Ruler, Upload } from "lucide-react";
import { useNavStore, type TabId } from "../../store/useNavStore";
import clsx from "clsx";

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "analyze", label: "Analyze", icon: SlidersHorizontal },
  { id: "measure", label: "Measure", icon: Ruler },
  { id: "upload", label: "Upload", icon: Upload },
];

export function BottomTabBar() {
  const activeTab = useNavStore((s) => s.activeTab);
  const setActiveTab = useNavStore((s) => s.setActiveTab);

  return (
    <div className="relative z-30 flex items-stretch justify-around border-t border-[var(--color-hairline)] bg-white pb-[max(6px,env(safe-area-inset-bottom))] pt-1">
      {TABS.map((t) => {
        const active = activeTab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            className="flex min-w-[64px] flex-1 flex-col items-center gap-0.5 py-1.5 active:scale-95"
            onClick={() => setActiveTab(t.id)}
          >
            <Icon size={22} color={active ? "#0066cc" : "#7a7a7a"} strokeWidth={active ? 2.3 : 2} />
            <span
              className={clsx("fine-text", active ? "font-semibold" : "font-normal")}
              style={{ color: active ? "#0066cc" : "#7a7a7a" }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
