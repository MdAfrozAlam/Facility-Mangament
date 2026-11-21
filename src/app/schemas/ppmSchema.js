import { z } from "zod";

export const ppmSchema = z.object({
  // --------------------------------
  // Asset
  // --------------------------------

  project: z
    .string()
    .min(1, "Project is required"),

  building: z
    .string()
    .min(1, "Building is required"),

  asset: z
    .string()
    .min(1, "Asset is required"),

  assetId: z.string(),

  assetName: z.string(),

  location: z.string(),

  qty: z
    .number({
      error: "Quantity is required",
    })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  // --------------------------------
  // PPM
  // --------------------------------

  ppmCode: z.string().optional(),

  instructionSet: z
    .string()
    .min(1, "Instruction Set is required"),

  family: z.string().optional(),

  priority: z
    .string()
    .min(1, "Priority is required"),

  estimationTime: z.string().optional(),

  estimationMen: z.string().optional(),

  stocklabCost: z.string().optional(),

  totalCost: z.string().optional(),

  financeCode: z
    .string()
    .min(1, "Finance Code is required"),

  costCenter: z
    .string()
    .min(1, "Cost Center is required"),

  costCode: z
    .string()
    .min(1, "Cost Code is required"),

  resource: z
    .string()
    .min(1, "Resource is required"),

  designation: z.string().optional(),

  shift: z.string().optional(),

  permitRequired: z.boolean(),

  healthSafety: z.boolean(),

  // --------------------------------
  // Service
  // --------------------------------

  lastService: z
    .string()
    .min(1, "Last Service is required"),

  serviceFrequency: z
    .string()
    .min(1, "Service Frequency is required")
    .refine(
      (value) => Number(value) > 0,
      "Frequency must be greater than 0"
    ),

  frequencyType: z
    .string()
    .min(1, "Frequency Type is required"),

  nextDue: z
    .string()
    .min(1, "Next Due is required"),

  week: z.string().optional(),
});