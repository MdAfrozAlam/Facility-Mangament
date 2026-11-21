export const ppmProjects = [
  {
    id: "PRJ-001",
    name: "LMG-IFM-DWC",
  },
  {
    id: "PRJ-002",
    name: "Corporate Office",
  },
  {
    id: "PRJ-003",
    name: "Mumbai Facility",
  },
];

export const ppmBuildings = [
  {
    id: "BLD-001",
    projectId: "PRJ-001",
    name: "Building-1",
  },
  {
    id: "BLD-002",
    projectId: "PRJ-001",
    name: "Building-2",
  },
  {
    id: "BLD-003",
    projectId: "PRJ-002",
    name: "Main Building",
  },
];

export const ppmAssets = [
  {
    id: "AST-001",
    projectId: "PRJ-001",
    buildingId: "BLD-001",
    assetId: "IFM-DXB-B01-RPLOMG-GF-ER-ELECTRICAL-DB-DB-01",
    assetName: "DB-01",
    location: "GF - Ground Floor",
    qty: 1,
    image: null,
  },
  {
    id: "AST-002",
    projectId: "PRJ-001",
    buildingId: "BLD-001",
    assetId: "IFM-DXB-B01-HVAC-GF-AC-01",
    assetName: "AC-01",
    location: "GF - Ground Floor",
    qty: 1,
    image: null,
  },
  {
    id: "AST-003",
    projectId: "PRJ-001",
    buildingId: "BLD-002",
    assetId: "IFM-DXB-B02-ELV-FF-EL-01",
    assetName: "Elevator-01",
    location: "First Floor",
    qty: 1,
    image: null,
  },
];

export const instructionSets = [
  "Electrical Inspection",
  "HVAC Maintenance",
  "Fire Safety Inspection",
  "General Equipment Maintenance",
];

export const priorities = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const financeCodes = [
  "FIN-001",
  "FIN-002",
  "FIN-003",
];

export const costCenters = [
  "CC-001",
  "CC-002",
  "CC-003",
];

export const costCodes = [
  "COST-001",
  "COST-002",
  "COST-003",
];

export const resources = [
  "Electrical Team",
  "HVAC Team",
  "Facility Team",
  "External Vendor",
];

export const shifts = [
  "Morning Shift",
  "General Shift",
  "Evening Shift",
  "Night Shift",
];

export const frequencyTypes = [
  "Days",
  "Weeks",
  "Months",
  "Years",
];

export const ppmProperties = [
  {
    id: "PROP-001",
    buildingId: "BLD-001",
    name: "Ground Floor",
  },
  {
    id: "PROP-002",
    buildingId: "BLD-001",
    name: "First Floor",
  },
  {
    id: "PROP-003",
    buildingId: "BLD-002",
    name: "Basement",
  },
  {
    id: "PROP-004",
    buildingId: "BLD-003",
    name: "Roof Top",
  },
];

export const serviceFrequencies = [
  "Daily",
  "Weekly",
  "Fortnightly",
  "Monthly",
  "Quarterly",
  "Half Yearly",
  "Yearly",
];

export const ppmCategories = [
  "Electrical",
  "HVAC",
  "Plumbing",
  "Fire Safety",
  "Civil",
];

export const systemTags = [
  "DB",
  "AHU",
  "FCU",
  "Chiller",
  "Elevator",
  "Fire Pump",
];

export const ppmSystems = [
  "Electrical",
  "HVAC",
  "Plumbing",
  "Fire Fighting",
  "Vertical Transportation",
];
