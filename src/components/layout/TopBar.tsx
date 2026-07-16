import { Menu } from "lucide-react";
import { useNavStore } from "../../store/useNavStore";
import { useState } from "react";

export function TopBar() {
  const setLayerPanelOpen = useNavStore((s) => s.setLayerPanelOpen);
  const [lang, setLang] = useState<"EN" | "TA">("EN");

  return (
    <div className="relative z-30 flex items-center justify-between bg-white px-3 py-2.5 shadow-[var(--shadow-float)]">
      <button
        aria-label="Open layers menu"
        className="flex h-11 w-11 items-center justify-center rounded-full active:scale-95"
        onClick={() => setLayerPanelOpen(true)}
      >
        <Menu size={22} color="#1d1d1f" />
      </button>
      <div className="flex flex-col items-center">
        <span className="text-[17px] font-semibold tracking-[-0.3px] text-[var(--color-ink)]">TNGIS</span>
        <span className="fine-text -mt-0.5 leading-none">Tamil Nadu Geographic Information System</span>
      </div>
      <button
        aria-label="Toggle language"
        className="flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-[13px] font-semibold active:scale-95"
        style={{ color: "#0066cc" }}
        onClick={() => setLang((l) => (l === "EN" ? "TA" : "EN"))}
      >
        {lang === "EN" ? "EN | த" : "த | EN"}
      </button>
    </div>
  );
}
