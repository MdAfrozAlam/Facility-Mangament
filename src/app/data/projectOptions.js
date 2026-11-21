// Static dropdown options for the Add Project form until the APIs are ready.

export const projectStatuses = [
  "Active",
  "Planned",
  "On Hold",
  "Completed",
];

export const accountProfiles = [
  { value: "ACC-001", label: "Emaar Properties" },
  { value: "ACC-002", label: "Nakheel" },
  { value: "ACC-003", label: "Aldar Properties" },
  { value: "ACC-004", label: "Dubai Holding" },
];

export const projectTypes = [
  "Residential",
  "Commercial",
  "Mixed Use",
  "Industrial",
  "Retail",
  "Hospitality",
];

export const countries = [
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "IN", label: "India" },
];

export const states = [
  { value: "DXB", countryId: "AE", label: "Dubai" },
  { value: "AUH", countryId: "AE", label: "Abu Dhabi" },
  { value: "SHJ", countryId: "AE", label: "Sharjah" },
  { value: "RIY", countryId: "SA", label: "Riyadh Province" },
  { value: "MAK", countryId: "SA", label: "Makkah Province" },
  { value: "MH", countryId: "IN", label: "Maharashtra" },
  { value: "KA", countryId: "IN", label: "Karnataka" },
];

export const cities = [
  { value: "DXB-DXB", stateId: "DXB", label: "Dubai" },
  { value: "DXB-HTA", stateId: "DXB", label: "Hatta" },
  { value: "AUH-AUH", stateId: "AUH", label: "Abu Dhabi" },
  { value: "AUH-AAN", stateId: "AUH", label: "Al Ain" },
  { value: "SHJ-SHJ", stateId: "SHJ", label: "Sharjah" },
  { value: "SHJ-KFK", stateId: "SHJ", label: "Khor Fakkan" },
  { value: "RIY-RIY", stateId: "RIY", label: "Riyadh" },
  { value: "MAK-JED", stateId: "MAK", label: "Jeddah" },
  { value: "MAK-MKH", stateId: "MAK", label: "Makkah" },
  { value: "MH-MUM", stateId: "MH", label: "Mumbai" },
  { value: "MH-PUN", stateId: "MH", label: "Pune" },
  { value: "KA-BLR", stateId: "KA", label: "Bengaluru" },
];

export const masterDevelopments = [
  { value: "MD-001", label: "Dubai Marina" },
  { value: "MD-002", label: "Downtown Dubai" },
  { value: "MD-003", label: "Palm Jumeirah" },
  { value: "MD-004", label: "Dubai World Central" },
];

export const pmAutoIssuanceOptions = [
  "Daily",
  "Weekly",
  "Monthly",
];

export const developers = [
  { value: "DEV-001", label: "Emaar Properties" },
  { value: "DEV-002", label: "Nakheel" },
  { value: "DEV-003", label: "Aldar Properties" },
  { value: "DEV-004", label: "Damac Properties" },
];

export const zones = [
  { value: "ZN-001", masterDevelopmentId: "MD-001", label: "Marina Promenade" },
  { value: "ZN-002", masterDevelopmentId: "MD-001", label: "Marina Walk" },
  { value: "ZN-003", masterDevelopmentId: "MD-002", label: "Burj Khalifa District" },
  { value: "ZN-004", masterDevelopmentId: "MD-002", label: "Opera District" },
  { value: "ZN-005", masterDevelopmentId: "MD-003", label: "The Trunk" },
  { value: "ZN-006", masterDevelopmentId: "MD-003", label: "The Fronds" },
  { value: "ZN-007", masterDevelopmentId: "MD-004", label: "Logistics District" },
  { value: "ZN-008", masterDevelopmentId: "MD-004", label: "Residential District" },
];
