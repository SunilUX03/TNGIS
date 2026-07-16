import type { District, Taluk, Village } from "../types";

export const districts: District[] = [
  { id: "chennai", name: "Chennai", nameTa: "சென்னை", center: [80.2707, 13.0827] },
  { id: "coimbatore", name: "Coimbatore", nameTa: "கோயம்புத்தூர்", center: [76.9558, 11.0168] },
  { id: "madurai", name: "Madurai", nameTa: "மதுரை", center: [78.1198, 9.9252] },
  { id: "thanjavur", name: "Thanjavur", nameTa: "தஞ்சாவூர்", center: [79.1378, 10.787] },
  { id: "villupuram", name: "Villupuram", nameTa: "விழுப்புரம்", center: [79.493, 11.9401] },
];

export const taluks: Taluk[] = [
  // Chennai
  { id: "egmore", districtId: "chennai", name: "Egmore", nameTa: "எழும்பூர்", center: [80.2609, 13.0732] },
  { id: "mylapore", districtId: "chennai", name: "Mylapore", nameTa: "மயிலாப்பூர்", center: [80.2707, 13.0339] },
  { id: "guindy", districtId: "chennai", name: "Guindy", nameTa: "கிண்டி", center: [80.22, 13.0067] },
  // Coimbatore
  { id: "cbe-north", districtId: "coimbatore", name: "Coimbatore North", nameTa: "கோயம்புத்தூர் வடக்கு", center: [76.967, 11.035] },
  { id: "cbe-south", districtId: "coimbatore", name: "Coimbatore South", nameTa: "கோயம்புத்தூர் தெற்கு", center: [76.9558, 10.995] },
  { id: "mettupalayam", districtId: "coimbatore", name: "Mettupalayam", nameTa: "மேட்டுப்பாளையம்", center: [76.9366, 11.2996] },
  // Madurai
  { id: "madurai-north", districtId: "madurai", name: "Madurai North", nameTa: "மதுரை வடக்கு", center: [78.13, 9.95] },
  { id: "madurai-south", districtId: "madurai", name: "Madurai South", nameTa: "மதுரை தெற்கு", center: [78.11, 9.88] },
  { id: "melur", districtId: "madurai", name: "Melur", nameTa: "மேலூர்", center: [78.34, 10.04] },
  // Thanjavur
  { id: "thanjavur-t", districtId: "thanjavur", name: "Thanjavur", nameTa: "தஞ்சாவூர்", center: [79.1378, 10.787] },
  { id: "kumbakonam", districtId: "thanjavur", name: "Kumbakonam", nameTa: "கும்பகோணம்", center: [79.3789, 10.9601] },
  { id: "papanasam", districtId: "thanjavur", name: "Papanasam", nameTa: "பாபநாசம்", center: [79.2733, 10.9333] },
  // Villupuram
  { id: "villupuram-t", districtId: "villupuram", name: "Villupuram", nameTa: "விழுப்புரம்", center: [79.493, 11.9401] },
  { id: "tindivanam", districtId: "villupuram", name: "Tindivanam", nameTa: "திண்டிவனம்", center: [79.648, 12.235] },
  { id: "vanur", districtId: "villupuram", name: "Vanur", nameTa: "வானூர்", center: [79.5993, 11.9339] },
];

interface VillageSeed {
  id: string;
  taluketId: string;
  name: string;
  nameTa: string;
  center: [number, number];
  panchayatOrWard: string;
  assembly: string;
  parliament: string;
}

const villageSeeds: VillageSeed[] = [
  // Egmore
  { id: "chetpet", taluketId: "egmore", name: "Chetpet", nameTa: "சேத்பேட்", center: [80.2437, 13.0716], panchayatOrWard: "Ward 108", assembly: "Chepauk-Thiruvallikeni", parliament: "Chennai Central" },
  { id: "kilpauk", taluketId: "egmore", name: "Kilpauk", nameTa: "கில்பாக்", center: [80.2425, 13.0827], panchayatOrWard: "Ward 71", assembly: "Egmore", parliament: "Chennai Central" },
  // Mylapore
  { id: "adyar", taluketId: "mylapore", name: "Adyar", nameTa: "அடையார்", center: [80.2565, 13.0012], panchayatOrWard: "Ward 175", assembly: "Mylapore", parliament: "Chennai South" },
  { id: "besant-nagar", taluketId: "mylapore", name: "Besant Nagar", nameTa: "பெசன்ட் நகர்", center: [80.2669, 13.0002], panchayatOrWard: "Ward 179", assembly: "Mylapore", parliament: "Chennai South" },
  // Guindy
  { id: "velachery", taluketId: "guindy", name: "Velachery", nameTa: "வேளச்சேரி", center: [80.2206, 12.9815], panchayatOrWard: "Ward 178", assembly: "Saidapet", parliament: "Chennai South" },
  { id: "taramani", taluketId: "guindy", name: "Taramani", nameTa: "தரமணி", center: [80.2422, 12.9873], panchayatOrWard: "Ward 176", assembly: "Saidapet", parliament: "Chennai South" },

  // Coimbatore North
  { id: "saravanampatti", taluketId: "cbe-north", name: "Saravanampatti", nameTa: "சரவணம்பட்டி", center: [76.9985, 11.0768], panchayatOrWard: "Ward 62", assembly: "Coimbatore North", parliament: "Coimbatore" },
  { id: "thudiyalur", taluketId: "cbe-north", name: "Thudiyalur", nameTa: "துடியலூர்", center: [76.9506, 11.0779], panchayatOrWard: "Thudiyalur Panchayat", assembly: "Coimbatore North", parliament: "Coimbatore" },
  // Coimbatore South
  { id: "podanur", taluketId: "cbe-south", name: "Podanur", nameTa: "பொடநூர்", center: [76.9711, 10.9558], panchayatOrWard: "Podanur Town Panchayat", assembly: "Kinathukadavu", parliament: "Pollachi" },
  { id: "sundarapuram", taluketId: "cbe-south", name: "Sundarapuram", nameTa: "சுந்தரபுரம்", center: [76.9714, 10.9722], panchayatOrWard: "Ward 88", assembly: "Coimbatore South", parliament: "Coimbatore" },
  // Mettupalayam
  { id: "kalveerampalayam", taluketId: "mettupalayam", name: "Kalveerampalayam", nameTa: "கல்வீரம்பாளையம்", center: [76.9213, 11.2802], panchayatOrWard: "Kalveerampalayam Panchayat", assembly: "Mettupalayam", parliament: "Nilgiris" },
  { id: "periyanaickenpalayam", taluketId: "mettupalayam", name: "Periyanaickenpalayam", nameTa: "பெரியநாயக்கன்பாளையம்", center: [76.9636, 11.2245], panchayatOrWard: "Periyanaickenpalayam Panchayat", assembly: "Mettupalayam", parliament: "Nilgiris" },

  // Madurai North
  { id: "anaiyur", taluketId: "madurai-north", name: "Anaiyur", nameTa: "அனையூர்", center: [78.1272, 9.9721], panchayatOrWard: "Ward 24", assembly: "Madurai North", parliament: "Madurai" },
  { id: "vilangudi", taluketId: "madurai-north", name: "Vilangudi", nameTa: "விளாங்குடி", center: [78.1339, 9.9553], panchayatOrWard: "Ward 33", assembly: "Madurai North", parliament: "Madurai" },
  // Madurai South
  { id: "thiruparankundram", taluketId: "madurai-south", name: "Thiruparankundram", nameTa: "திருப்பரங்குன்றம்", center: [78.0806, 9.8681], panchayatOrWard: "Thiruparankundram Town Panchayat", assembly: "Thiruparankundram", parliament: "Madurai" },
  { id: "pasumalai", taluketId: "madurai-south", name: "Pasumalai", nameTa: "பசுமலை", center: [78.1044, 9.8886], panchayatOrWard: "Ward 63", assembly: "Madurai South", parliament: "Madurai" },
  // Melur
  { id: "alanganallur", taluketId: "melur", name: "Alanganallur", nameTa: "அலங்காநல்லூர்", center: [78.0431, 10.0511], panchayatOrWard: "Alanganallur Panchayat", assembly: "Melur", parliament: "Madurai" },
  { id: "sholavandan", taluketId: "melur", name: "Sholavandan", nameTa: "சோலவந்தான்", center: [77.9425, 10.0428], panchayatOrWard: "Sholavandan Panchayat", assembly: "Melur", parliament: "Madurai" },

  // Thanjavur
  { id: "vallam", taluketId: "thanjavur-t", name: "Vallam", nameTa: "வல்லம்", center: [79.1789, 10.7431], panchayatOrWard: "Vallam Panchayat", assembly: "Thanjavur", parliament: "Thanjavur" },
  { id: "thiruvaiyaru", taluketId: "thanjavur-t", name: "Thiruvaiyaru", nameTa: "திருவையாறு", center: [79.0783, 10.8586], panchayatOrWard: "Thiruvaiyaru Town Panchayat", assembly: "Thiruvaiyaru", parliament: "Thanjavur" },
  // Kumbakonam
  { id: "darasuram", taluketId: "kumbakonam", name: "Darasuram", nameTa: "தாராசுரம்", center: [79.3722, 10.9394], panchayatOrWard: "Darasuram Panchayat", assembly: "Kumbakonam", parliament: "Mayiladuthurai" },
  { id: "swamimalai", taluketId: "kumbakonam", name: "Swamimalai", nameTa: "சுவாமிமலை", center: [79.3306, 10.9683], panchayatOrWard: "Swamimalai Panchayat", assembly: "Kumbakonam", parliament: "Mayiladuthurai" },
  // Papanasam
  { id: "sooriyanarkoil", taluketId: "papanasam", name: "Sooriyanarkoil", nameTa: "சூரியனார்கோயில்", center: [79.3172, 10.9264], panchayatOrWard: "Sooriyanarkoil Panchayat", assembly: "Papanasam", parliament: "Mayiladuthurai" },
  { id: "kabisthalam", taluketId: "papanasam", name: "Kabisthalam", nameTa: "கபிஸ்தலம்", center: [79.2158, 10.8961], panchayatOrWard: "Kabisthalam Panchayat", assembly: "Papanasam", parliament: "Mayiladuthurai" },

  // Villupuram
  { id: "kandamangalam", taluketId: "villupuram-t", name: "Kandamangalam", nameTa: "கண்டமங்கலம்", center: [79.4231, 11.9628], panchayatOrWard: "Kandamangalam Panchayat", assembly: "Villupuram", parliament: "Villupuram" },
  { id: "mundiyampakkam", taluketId: "villupuram-t", name: "Mundiyampakkam", nameTa: "முண்டியம்பாக்கம்", center: [79.5342, 11.9089], panchayatOrWard: "Mundiyampakkam Panchayat", assembly: "Villupuram", parliament: "Villupuram" },
  // Tindivanam
  { id: "melmalayanur", taluketId: "tindivanam", name: "Melmalayanur", nameTa: "மேல்மலையனூர்", center: [79.3703, 12.1614], panchayatOrWard: "Melmalayanur Panchayat", assembly: "Vanur", parliament: "Villupuram" },
  { id: "vikravandi", taluketId: "tindivanam", name: "Vikravandi", nameTa: "விக்கிரவாண்டி", center: [79.5525, 12.0367], panchayatOrWard: "Vikravandi Panchayat", assembly: "Vikravandi", parliament: "Villupuram" },
  // Vanur
  { id: "ozhukarai", taluketId: "vanur", name: "Ozhukarai", nameTa: "ஒழுகரை", center: [79.5814, 11.9628], panchayatOrWard: "Ozhukarai Panchayat", assembly: "Vanur", parliament: "Villupuram" },
  { id: "sithalingamadam", taluketId: "vanur", name: "Sithalingamadam", nameTa: "சிதலிங்கமடம்", center: [79.7256, 11.9147], panchayatOrWard: "Sithalingamadam Panchayat", assembly: "Vanur", parliament: "Villupuram" },
];

export const villages: Village[] = villageSeeds.map((v) => {
  const taluk = taluks.find((t) => t.id === v.taluketId)!;
  const district = districts.find((d) => d.id === taluk.districtId)!;
  return {
    id: v.id,
    taluketId: v.taluketId,
    taluketName: taluk.name,
    taluketDistrictId: district.id,
    taluketDistrictName: district.name,
    taluketAssembly: v.assembly,
    taluketParliament: v.parliament,
    name: v.name,
    nameTa: v.nameTa,
    center: v.center,
    panchayatOrWard: v.panchayatOrWard,
  };
});

export function talukById(id: string) {
  return taluks.find((t) => t.id === id);
}
export function districtById(id: string) {
  return districts.find((d) => d.id === id);
}
export function villagesByTaluk(talukId: string) {
  return villages.filter((v) => v.taluketId === talukId);
}
export function taluksByDistrict(districtId: string) {
  return taluks.filter((t) => t.districtId === districtId);
}
