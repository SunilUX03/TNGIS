import type { RailFeature, RoadFeature } from "../types";

export const roads: RoadFeature[] = [
  {
    id: "nh32",
    name: "NH 32 (Chennai — Villupuram — Puducherry)",
    type: "National Highway",
    path: [
      [80.221, 13.0067], [79.9, 12.4], [79.72, 12.19], [79.63, 12.03],
      [79.5993, 11.9339], [79.493, 11.9401],
    ],
  },
  {
    id: "nh785",
    name: "NH 785 (Coimbatore — Madurai)",
    type: "National Highway",
    path: [
      [76.9558, 10.995], [77.4, 10.7], [77.9, 10.3], [78.11, 9.88],
    ],
  },
  {
    id: "nh36",
    name: "NH 36 (Trichy — Thanjavur — Karaikal)",
    type: "National Highway",
    path: [
      [78.9, 10.8], [79.05, 10.79], [79.1378, 10.787], [79.3789, 10.9601],
    ],
  },
  {
    id: "sh68",
    name: "SH 68 (Mettupalayam — Coimbatore)",
    type: "State Highway",
    path: [[76.9366, 11.2996], [76.95, 11.15], [76.9558, 11.0168]],
  },
  {
    id: "sh38",
    name: "SH 38 (Tindivanam — Villupuram)",
    type: "State Highway",
    path: [[79.648, 12.235], [79.58, 12.1], [79.493, 11.9401]],
  },
];

export const railways: RailFeature[] = [
  {
    id: "rail-trunk",
    name: "Chennai — Villupuram — Trichy Trunk Line",
    path: [[80.2707, 13.0827], [79.9, 12.4], [79.493, 11.9401], [78.9, 10.8]],
  },
  {
    id: "rail-nilgiri",
    name: "Nilgiri Mountain Railway (Mettupalayam — Coonoor)",
    path: [[76.9366, 11.2996], [76.85, 11.35], [76.79, 11.42]],
  },
];
