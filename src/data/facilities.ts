import type { Facility } from "../types";

export const facilities: Facility[] = [
  // Chennai
  { id: "f-1", name: "Government Higher Secondary School, Adyar", category: "School", districtId: "chennai", address: "Lattice Bridge Rd, Adyar, Chennai", position: [80.2545, 13.0032] },
  { id: "f-2", name: "Government General Hospital, Kilpauk", category: "Hospital", districtId: "chennai", address: "Poonamallee High Rd, Kilpauk, Chennai", position: [80.2404, 13.0838] },
  { id: "f-3", name: "Tahsildar Office, Mylapore", category: "Government Office", districtId: "chennai", address: "R K Mutt Rd, Mylapore, Chennai", position: [80.2685, 13.0335] },
  { id: "f-4", name: "PDS Fair Price Shop, Velachery", category: "PDS Shop", districtId: "chennai", address: "100 Feet Rd, Velachery, Chennai", position: [80.2192, 12.9798] },
  { id: "f-5", name: "Common Service Centre, Taramani", category: "Common Service Centre", districtId: "chennai", address: "CIT Campus Rd, Taramani, Chennai", position: [80.2415, 12.9865] },
  { id: "f-6", name: "Besant Nagar Police Station", category: "Police Station", districtId: "chennai", address: "Elliots Beach Rd, Besant Nagar, Chennai", position: [80.2668, 13.0001] },
  { id: "f-7", name: "Guindy Bus Stand", category: "Bus Stand", districtId: "chennai", address: "GST Rd, Guindy, Chennai", position: [80.2185, 13.0095] },

  // Coimbatore
  { id: "f-8", name: "Government Higher Secondary School, Saravanampatti", category: "School", districtId: "coimbatore", address: "Sathy Main Rd, Saravanampatti, Coimbatore", position: [76.9993, 11.0781] },
  { id: "f-9", name: "Coimbatore Medical College Hospital", category: "Hospital", districtId: "coimbatore", address: "Trichy Rd, Coimbatore", position: [76.9906, 10.9931] },
  { id: "f-10", name: "Taluk Office, Mettupalayam", category: "Government Office", districtId: "coimbatore", address: "Bazaar St, Mettupalayam", position: [76.9401, 11.2988] },
  { id: "f-11", name: "PDS Fair Price Shop, Thudiyalur", category: "PDS Shop", districtId: "coimbatore", address: "Mettupalayam Rd, Thudiyalur, Coimbatore", position: [76.9498, 11.0787] },
  { id: "f-12", name: "Common Service Centre, Podanur", category: "Common Service Centre", districtId: "coimbatore", address: "Station Rd, Podanur, Coimbatore", position: [76.9722, 10.9552] },
  { id: "f-13", name: "Periyanaickenpalayam Police Station", category: "Police Station", districtId: "coimbatore", address: "Mettupalayam Rd, Periyanaickenpalayam", position: [76.9639, 11.2251] },
  { id: "f-14", name: "Gandhipuram Central Bus Stand", category: "Bus Stand", districtId: "coimbatore", address: "Cross Cut Rd, Gandhipuram, Coimbatore", position: [76.9675, 11.0175] },

  // Madurai
  { id: "f-15", name: "Government Higher Secondary School, Vilangudi", category: "School", districtId: "madurai", address: "Melur Main Rd, Vilangudi, Madurai", position: [78.1345, 9.9558] },
  { id: "f-16", name: "Government Rajaji Hospital", category: "Hospital", districtId: "madurai", address: "Panagal Rd, Madurai", position: [78.1173, 9.9236] },
  { id: "f-17", name: "Taluk Office, Melur", category: "Government Office", districtId: "madurai", address: "Main Bazaar, Melur", position: [78.3396, 10.0402] },
  { id: "f-18", name: "PDS Fair Price Shop, Anaiyur", category: "PDS Shop", districtId: "madurai", address: "Natham Rd, Anaiyur, Madurai", position: [78.1278, 9.9725] },
  { id: "f-19", name: "Common Service Centre, Thiruparankundram", category: "Common Service Centre", districtId: "madurai", address: "Trichy Rd, Thiruparankundram, Madurai", position: [78.081, 9.8684] },
  { id: "f-20", name: "Alanganallur Police Station", category: "Police Station", districtId: "madurai", address: "Palamedu Rd, Alanganallur", position: [78.0434, 10.0514] },

  // Thanjavur
  { id: "f-21", name: "Government Higher Secondary School, Thiruvaiyaru", category: "School", districtId: "thanjavur", address: "Agraharam St, Thiruvaiyaru, Thanjavur", position: [79.0787, 10.859] },
  { id: "f-22", name: "Thanjavur Medical College Hospital", category: "Hospital", districtId: "thanjavur", address: "Vallam Main Rd, Thanjavur", position: [79.1466, 10.7772] },
  { id: "f-23", name: "Taluk Office, Kumbakonam", category: "Government Office", districtId: "thanjavur", address: "Big Bazaar St, Kumbakonam", position: [79.3792, 10.9605] },
  { id: "f-24", name: "PDS Fair Price Shop, Vallam", category: "PDS Shop", districtId: "thanjavur", address: "Thanjavur-Vallam Rd, Vallam", position: [79.1792, 10.7435] },
  { id: "f-25", name: "Common Service Centre, Papanasam", category: "Common Service Centre", districtId: "thanjavur", address: "Kumbakonam Rd, Papanasam", position: [79.2736, 10.9337] },
  { id: "f-26", name: "Kumbakonam Bus Stand", category: "Bus Stand", districtId: "thanjavur", address: "TPK Rd, Kumbakonam", position: [79.3823, 10.9587] },

  // Villupuram
  { id: "f-27", name: "Government Higher Secondary School, Vanur", category: "School", districtId: "villupuram", address: "Villupuram Main Rd, Vanur", position: [79.5996, 11.9342] },
  { id: "f-28", name: "Government Hospital, Tindivanam", category: "Hospital", districtId: "villupuram", address: "Chennai-Trichy Rd, Tindivanam", position: [79.6483, 12.2354] },
  { id: "f-29", name: "Taluk Office, Villupuram", category: "Government Office", districtId: "villupuram", address: "Collectorate Rd, Villupuram", position: [79.4933, 11.9404] },
  { id: "f-30", name: "PDS Fair Price Shop, Vikravandi", category: "PDS Shop", districtId: "villupuram", address: "Villupuram Rd, Vikravandi", position: [79.5528, 12.037] },
  { id: "f-31", name: "Common Service Centre, Mundiyampakkam", category: "Common Service Centre", districtId: "villupuram", address: "Villupuram-Vanur Rd, Mundiyampakkam", position: [79.5345, 11.9092] },
  { id: "f-32", name: "Villupuram Police Station", category: "Police Station", districtId: "villupuram", address: "Trunk Rd, Villupuram", position: [79.4921, 11.939] },
];
