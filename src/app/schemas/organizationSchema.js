import { z } from "zod";

const phonePattern = /^\+?[\d\s()-]{6,20}$/;

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  contactPerson: z
    .string()
    .trim()
    .min(1, "Contact Person is required"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email")),

  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(phonePattern, "Enter a valid phone number"),

  telephone: z
    .string()
    .trim()
    .refine(
      (value) => !value || phonePattern.test(value),
      "Enter a valid telephone number"
    ),

  // --------------------------------
  // Address
  // --------------------------------

  street: z
    .string()
    .trim()
    .min(1, "Street is required"),

  city: z
    .string()
    .trim()
    .min(1, "City is required"),
});
