import { useRef, useState, type ReactNode } from "react";
import { useNavStore, type SheetSnap } from "../../store/useNavStore";

export const SHEET_HEIGHTS: Record<SheetSnap, number> = { peek: 132, half: 320, full: 460 };
const MIN_HEIGHT = 56;

export function BottomSheet({ children }: { children: ReactNode }) {
  const snap = useNavStore((s) => s.sheetSnap);
  const setSnap = useNavStore((s) => s.setSheetSnap);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const dragStart = useRef<{ y: number; height: number } | null>(null);

  const currentHeight = dragHeight ?? SHEET_HEIGHTS[snap];

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragStart.current = { y: e.clientY, height: SHEET_HEIGHTS[snap] };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragStart.current) return;
    const delta = dragStart.current.y - e.clientY;
    const next = Math.min(560, Math.max(MIN_HEIGHT, dragStart.current.height + delta));
    setDragHeight(next);
  }
  function onPointerUp() {
    if (dragHeight === null) {
      dragStart.current = null;
      return;
    }
    const entries = Object.entries(SHEET_HEIGHTS) as [SheetSnap, number][];
    let nearest: SheetSnap = "peek";
    let nearestDist = Infinity;
    for (const [key, h] of entries) {
      const d = Math.abs(h - dragHeight);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = key;
      }
    }
    if (dragHeight < 90) nearest = "peek"; // never let it collapse below a usable handle strip
    setSnap(nearest);
    setDragHeight(null);
    dragStart.current = null;
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[var(--radius-card)] shadow-[var(--shadow-float)] transition-[height] duration-200 ease-out"
      style={{
        height: currentHeight,
        background: "var(--color-parchment)",
        transitionDuration: dragHeight !== null ? "0ms" : "200ms",
      }}
    >
      <div
        className="flex w-full shrink-0 cursor-grab touch-none flex-col items-center pt-2 pb-1 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="h-1.5 w-10 rounded-full" style={{ background: "var(--color-hairline)" }} />
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar" style={{ paddingTop: 8 }}>
        {children}
      </div>
    </div>
  );
}
