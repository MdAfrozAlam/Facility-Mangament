import { z } from "zod";

const optionalText = z.string().trim();

const requiredText = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`);

// Number without the country code, which is picked separately.
const phonePattern = /^[\d\s-]{6,15}$/;

const requiredPhone = (label) =>
  requiredText(label).regex(phonePattern, `Enter a valid ${label}`);

const requiredEmail = (label) =>
  requiredText(label).pipe(z.email("Enter a valid email"));

// Property Info tab: one unit row, validated when "Add" is clicked.
export const customerUnitSchema = z.object({
  master_development: requiredText("Master Development"),

  building: requiredText("Building"),

  floor: requiredText("Floor"),

  unit: requiredText("Unit"),

  owner_occupied: z.boolean(),
});

// Documents tab: one document row, validated when "Add" is clicked.
// The file itself is checked in the component (zod only sees form values).
export const customerDocumentSchema = z.object({
  document_type: requiredText("Document Type"),

  document_no: optionalText,

  expiry_date: optionalText,
});

export const customerSchema = z.object({
  // --------------------------------
  // General / Status
  // --------------------------------

  is_vip: z.boolean(),

  status: requiredText("Status"),

  // --------------------------------
  // General information
  // --------------------------------

  customer_type: requiredText("Customer Type"),

  customer_category: requiredText("Customer Category"),

  // --------------------------------
  // Profile information
  // --------------------------------

  first_name: requiredText("First Name"),

  middle_name: optionalText,

  last_name: requiredText("Last Name"),

  dob: requiredText("DOB").refine(
    (value) => !value || new Date(value) < new Date(),
    "DOB must be in the past"
  ),

  nationality: requiredText("Nationality"),

  national_id_no: optionalText,

  passport_no: optionalText,

  gender: requiredText("Gender"),

  // --------------------------------
  // Address
  // --------------------------------

  country: requiredText("Country"),

  state: requiredText("State"),

  city: requiredText("City"),

  street_no: optionalText,

  street_name: optionalText,

  land_mark: optionalText,

  po_box: optionalText,

  // --------------------------------
  // Contact Information
  // --------------------------------

  mobile_code: requiredText("Code"),

  mobile_no: requiredPhone("Mobile No"),

  email: requiredEmail("Email Address"),

  land_code: requiredText("Code"),

  land_no: requiredPhone("Land No"),

  fax_code: requiredText("Code"),

  fax: requiredPhone("Fax"),

  // --------------------------------
  // Emergency Contact
  // --------------------------------

  emergency_name: optionalText,

  emergency_last_name: optionalText,

  emergency_relationship: optionalText,

  emergency_mobile_code: requiredText("Code"),

  emergency_mobile_no: requiredPhone("Mobile No"),

  emergency_email: requiredEmail("Email Address"),
});
