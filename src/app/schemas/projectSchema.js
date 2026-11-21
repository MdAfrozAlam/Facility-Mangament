import { z } from "zod";

const optionalText = z.string().trim();

const optionalArea = z
  .string()
  .trim()
  .refine(
    (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter a valid area"
  );

export const projectSchema = z.object({
  // --------------------------------
  // General Info
  // --------------------------------

  status: z
    .string()
    .min(1, "Status is required"),

  account_profile: z
    .string()
    .min(1, "Account Profile is required"),

  community_code: z
    .string()
    .trim()
    .min(1, "Community Code is required"),

  community_title: z
    .string()
    .trim()
    .min(1, "Community Title is required"),

  main_reference_no: optionalText,

  project_type: z
    .string()
    .min(1, "Project Type is required"),

  project_alias: optionalText,

  // --------------------------------
  // Address
  // --------------------------------

  country: z
    .string()
    .min(1, "Country is required"),

  state: z
    .string()
    .min(1, "State is required"),

  city: z
    .string()
    .min(1, "City is required"),

  master_development: z.string(),

  zone: z.string(),

  street_no: optionalText,

  street_name: optionalText,

  po_box: optionalText.refine(
    (value) => !value || /^[\dA-Za-z\s-]{1,20}$/.test(value),
    "Enter a valid PO Box"
  ),

  // --------------------------------
  // Finance
  // --------------------------------

  project_value: z
    .string()
    .trim()
    .refine(
      (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0),
      "Enter a valid project value"
    ),

  // --------------------------------
  // Contract Details
  // --------------------------------

  start_date: z.string(),

  end_date: z.string(),

  review_date: z.string(),

  is_overridden_workorder: z.boolean(),

  pm_auto_issuance: z.string(),

  frequency: z
    .string()
    .trim()
    .refine(
      (value) => !value || (Number.isInteger(Number(value)) && Number(value) > 0),
      "Enter a valid frequency"
    ),

  // --------------------------------
  // Dimensions
  // --------------------------------

  builtup_area_sqft: optionalArea,

  builtup_area_sqm: optionalArea,

  plot_area_sqft: optionalArea,

  plot_area_sqm: optionalArea,

  developed_by: z.string(),

  comment: optionalText,
})
  .refine(
    (project) =>
      !project.start_date ||
      !project.end_date ||
      project.end_date >= project.start_date,
    {
      path: ["end_date"],
      message: "End Date cannot be before Start Date",
    }
  );
