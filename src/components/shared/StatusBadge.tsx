import type { LandClassification } from "../../types";

const CLASSIFICATION_STYLE: Record<LandClassification, { bg: string; fg: string }> = {
  Agricultural: { bg: "var(--color-parchment)", fg: "var(--color-secondary)" },
  "Non-Agricultural": { bg: "rgba(0,102,204,0.1)", fg: "#0066cc" },
  "Government Vacant": { bg: "rgba(26,127,55,0.1)", fg: "var(--color-success)" },
  Forest: { bg: "rgba(185,80,0,0.1)", fg: "var(--color-warning)" },
  "Water Body": { bg: "rgba(196,30,58,0.1)", fg: "var(--color-danger)" },
};

export function ClassificationBadge({ classification }: { classification: LandClassification }) {
  const style = CLASSIFICATION_STYLE[classification];
  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-compact)] px-2.5 py-1 caption-text font-medium"
      style={{ background: style.bg, color: style.fg }}
    >
      {classification}
    </span>
  );
}

export function RiskStatusBadge({ affected }: { affected: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[var(--radius-compact)] px-2.5 py-1 caption-text font-medium"
      style={{
        background: affected ? "rgba(185,80,0,0.1)" : "rgba(26,127,55,0.1)",
        color: affected ? "var(--color-warning)" : "var(--color-success)",
      }}
    >
      {affected ? "⚠ Overlaps" : "✓ Not affected"}
    </span>
  );
}
