import { mockInternalUsers } from "./internalUsers";

// Permission columns shown in the access grid (in display order)
export const accessActions = [
  { key: "add", label: "Add" },
  { key: "update", label: "Update" },
  { key: "view", label: "View" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
  { key: "upload", label: "Upload" },
  { key: "download", label: "Download" },
  { key: "print", label: "Print" },
  { key: "export", label: "Export" },
];

const uniqueOptions = (valueKey, labelKey) => {
  const seen = new Map();

  mockInternalUsers.forEach((user) => {
    if (user[valueKey] && !seen.has(user[valueKey])) {
      seen.set(user[valueKey], user[labelKey] || user[valueKey]);
    }
  });

  return [...seen].map(([value, label]) => ({ value, label }));
};

// Roles and role accesses come from the Internal Users master list
export const roleOptions = uniqueOptions("roleCode", "roleName");
export const roleAccessOptions = uniqueOptions(
  "roleAccessCode",
  "roleAccessName"
);

export const accessMenuItems = [
  { id: "dashboard-asset-system", menuItem: "Dashboard - Asset System" },
  { id: "reports-assets", menuItem: "Reports - Assets Reports" },
  { id: "reports-contract-performance", menuItem: "Reports - Contract Performance" },
  { id: "reports-monthly", menuItem: "Reports - Monthly Reporting" },
  { id: "reports-pms", menuItem: "Reports - PMS Report" },
  { id: "reports-bulk-export-pdf", menuItem: "Reports - Bulk Export PDF" },
  { id: "reports-break-down", menuItem: "Reports - Break Down Report" },
  { id: "reports-resource-costing", menuItem: "Reports - Resource Costing Report" },
  { id: "reports-feedback-survey", menuItem: "Reports - Feedback Survey Report" },
  { id: "reports-ppm", menuItem: "Reports - PPM Report" },
  { id: "pm-scheduler-create", menuItem: "PM Scheduler - Create New" },
  { id: "pm-scheduler-list", menuItem: "PM Scheduler - Scheduler List" },
  { id: "pm-planner", menuItem: "PM Planner" },
  { id: "pm-issuer", menuItem: "PM Issuer" },
  { id: "work-orders-all", menuItem: "Work Orders - All Work Orders" },
  { id: "work-orders-reactive", menuItem: "Work Orders - Add Reactive Work" },
  { id: "work-orders-pm-log", menuItem: "Work Orders - Add PM Log" },
  { id: "assets-register", menuItem: "Assets - Asset Register" },
  { id: "core-organization", menuItem: "Core - Organization" },
  { id: "core-accounts", menuItem: "Core - Accounts" },
  { id: "core-projects", menuItem: "Core - Projects" },
  { id: "user-management-internal-users", menuItem: "User Management - Internal Users" },
  { id: "user-management-customers", menuItem: "User Management - Customers" },
  { id: "user-management-access-settings", menuItem: "User Management - Internal Users Access Settings" },
];

const allowAll = () =>
  Object.fromEntries(accessActions.map(({ key }) => [key, true]));

const viewOnly = () =>
  Object.fromEntries(accessActions.map(({ key }) => [key, key === "view"]));

/*
 * Saved permissions keyed by `${roleCode}:${roleAccessCode}`, then menu item id.
 * Missing entries mean "no access".
 */
export const mockAccessSettings = {
  "ADM:FULL": Object.fromEntries(
    accessMenuItems.map(({ id }) => [id, allowAll()])
  ),
  "HLP:CRT": Object.fromEntries(
    accessMenuItems
      .filter(({ id }) => id.startsWith("work-orders"))
      .map(({ id }) => [id, { ...viewOnly(), add: true }])
  ),
};
