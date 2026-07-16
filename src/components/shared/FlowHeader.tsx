import { ArrowLeft, X } from "lucide-react";

export function FlowHeader({
  title,
  subtitle,
  onBack,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {onBack && (
        <button aria-label="Back" onClick={onBack} className="flex h-9 w-9 shrink-0 items-center justify-center active:scale-95">
          <ArrowLeft size={18} color="#1d1d1f" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[20px]">{title}</h2>
        {subtitle && <p className="fine-text truncate">{subtitle}</p>}
      </div>
      <button aria-label="Close" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center active:scale-95">
        <X size={18} color="#7a7a7a" />
      </button>
    </div>
  );
}
