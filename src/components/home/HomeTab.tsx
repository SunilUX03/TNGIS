import { useNavStore } from "../../store/useNavStore";
import { QuickActionCards } from "./QuickActionCards";
import { FindVacantLandFlow } from "./FindVacantLandFlow";
import { CheckLandRiskFlow } from "./CheckLandRiskFlow";
import { WhatAreaAmIInFlow } from "./WhatAreaAmIInFlow";
import { NearbyFacilitiesFlow } from "./NearbyFacilitiesFlow";

export function HomeTab() {
  const homeFlow = useNavStore((s) => s.homeFlow);

  if (homeFlow === "vacant-land") return <FindVacantLandFlow />;
  if (homeFlow === "risk-check") return <CheckLandRiskFlow />;
  if (homeFlow === "area-lookup") return <WhatAreaAmIInFlow />;
  if (homeFlow === "facilities") return <NearbyFacilitiesFlow />;
  return <QuickActionCards />;
}
