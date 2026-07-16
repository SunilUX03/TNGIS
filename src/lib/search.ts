import type { SearchIndexEntry } from "../types";
import { districts, villages } from "../data/geography";
import { parcels } from "../data/parcels";

function buildIndex(): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];

  for (const d of districts) {
    entries.push({
      id: "district-" + d.id,
      type: "district",
      label: d.name,
      sublabel: "District",
      center: d.center,
      zoom: 10,
    });
  }

  for (const v of villages) {
    entries.push({
      id: "village-" + v.id,
      type: "village",
      label: v.name,
      sublabel: `${v.taluketName}, ${v.taluketDistrictName}`,
      center: v.center,
      zoom: 14,
    });
  }

  for (const p of parcels) {
    entries.push({
      id: "parcel-" + p.id,
      type: "parcel",
      label: p.surveyNo,
      sublabel: `${p.villageName}, ${p.taluketName}, ${p.districtName}`,
      center: p.center,
      zoom: 17,
      parcelId: p.id,
    });
  }

  return entries;
}

export const searchIndex = buildIndex();

export function searchMock(query: string, limit = 12): SearchIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = searchIndex
    .map((e) => {
      const label = e.label.toLowerCase();
      const sub = e.sublabel.toLowerCase();
      let score = -1;
      if (label === q) score = 100;
      else if (label.startsWith(q)) score = 80;
      else if (label.includes(q)) score = 60;
      else if (sub.includes(q)) score = 30;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.e.label.localeCompare(b.e.label));

  return scored.slice(0, limit).map((x) => x.e);
}

/** Village name searches can be ambiguous across districts — surface all matches for disambiguation. */
export function exactVillageMatches(query: string): SearchIndexEntry[] {
  const q = query.trim().toLowerCase();
  return searchIndex.filter((e) => e.type === "village" && e.label.toLowerCase() === q);
}
