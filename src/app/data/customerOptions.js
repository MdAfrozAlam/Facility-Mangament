// Static dropdown options for the Add Customer form until the APIs are ready.
// Country / State / City reuse the lists from projectOptions.

export {
  countries,
  states,
  cities,
  masterDevelopments,
} from "./projectOptions";

// Property Info: Master Development -> Building -> Floor
export const buildings = [
  { value: "BLD-001", masterDevelopmentId: "MD-001", label: "Marina Heights" },
  { value: "BLD-002", masterDevelopmentId: "MD-001", label: "Marina Crown" },
  { value: "BLD-003", masterDevelopmentId: "MD-002", label: "Al Noor Tower" },
  { value: "BLD-004", masterDevelopmentId: "MD-002", label: "Boulevard Plaza" },
  { value: "BLD-005", masterDevelopmentId: "MD-003", label: "Palm Residences" },
  { value: "BLD-006", masterDevelopmentId: "MD-003", label: "Shoreline Apartments" },
  { value: "BLD-007", masterDevelopmentId: "MD-004", label: "Business Bay Plaza" },
  { value: "BLD-008", masterDevelopmentId: "MD-004", label: "Logistics Hub A" },
];

const floorCodes = ["G", "F-01", "F-02", "F-03", "F-04", "F-05"];

export const floors = buildings.flatMap((building) =>
  floorCodes.map((code) => ({
    value: `${building.value}-${code}`,
    buildingId: building.value,
    label: code,
  }))
);

export const customerStatuses = ["New", "Active", "Inactive", "Pending"];

export const customerTypes = [
  { value: "owner", label: "Owner" },
  { value: "tenant", label: "Tenant" },
  { value: "managing_agent", label: "Managing Agent" },
  { value: "others", label: "Others" },
];

export const customerCategories = [
  { value: "corporate", label: "Corporate" },
  { value: "individual", label: "Individual" },
];

export const nationalities = [
  { value: "AE", label: "Emirati" },
  { value: "SA", label: "Saudi" },
  { value: "IN", label: "Indian" },
  { value: "PK", label: "Pakistani" },
  { value: "EG", label: "Egyptian" },
  { value: "PH", label: "Filipino" },
  { value: "GB", label: "British" },
  { value: "US", label: "American" },
];

export const genders = ["Male", "Female"];

export const dialCodes = [
  { value: "+971", label: "+971" },
  { value: "+966", label: "+966" },
  { value: "+974", label: "+974" },
  { value: "+965", label: "+965" },
  { value: "+968", label: "+968" },
  { value: "+973", label: "+973" },
  { value: "+91", label: "+91" },
  { value: "+92", label: "+92" },
  { value: "+20", label: "+20" },
  { value: "+63", label: "+63" },
  { value: "+44", label: "+44" },
  { value: "+1", label: "+1" },
];

export const documentTypes = [
  { value: "passport", label: "Passport" },
  { value: "emirates_id", label: "Emirates ID" },
  { value: "visa", label: "Visa" },
  { value: "trade_license", label: "Trade License" },
  { value: "title_deed", label: "Title Deed" },
  { value: "tenancy_contract", label: "Tenancy Contract (Ejari)" },
  { value: "power_of_attorney", label: "Power of Attorney" },
  { value: "other", label: "Other" },
];

export const relationships = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Relative",
  "Friend",
  "Colleague",
  "Other",
];
