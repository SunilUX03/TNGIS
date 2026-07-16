import { useNavStore } from "../../store/useNavStore";

export function Toast() {
  const toast = useNavStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[72px] z-40 flex justify-center px-4">
      <div className="rounded-full bg-[var(--color-ink)] px-4 py-2.5 caption-text font-medium text-white shadow-[var(--shadow-float)]">
        {toast}
      </div>
    </div>
  );
}
