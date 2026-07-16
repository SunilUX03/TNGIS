import type { EnvLayerType, LandClassification } from "../types";

export const ACTION_BLUE = "#0066cc";

export const CLASSIFICATION_COLOR: Record<LandClassification, string> = {
  Agricultural: "#8a9a5b",
  "Non-Agricultural": "#0066cc",
  "Government Vacant": "#1a7f37",
  Forest: "#b95000",
  "Water Body": "#c41e3a",
};

export const ENV_COLOR: Record<EnvLayerType, string> = {
  crz: "#b95000",
  reserveForest: "#2f6b3a",
  floodZone: "#2f7d9e",
  ecoSensitive: "#8a7a2f",
  waterBody: "#3b82c4",
};

export const ENV_LABEL: Record<EnvLayerType, string> = {
  crz: "Coastal Regulation Zone",
  reserveForest: "Reserve Forest",
  floodZone: "Flood Inundation Area",
  ecoSensitive: "Eco Sensitive Zone",
  waterBody: "Water Body",
};
