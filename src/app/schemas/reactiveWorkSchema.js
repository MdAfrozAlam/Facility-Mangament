import { z } from "zod";

export const reactiveWorkSchema = z.object({
  // --------------------------------
  // Account
  // --------------------------------

  project: z.string().min(1, "Project is required"),

  building: z.string().min(1, "Building is required"),

  floor: z.string().optional(),

  unit: z.string().optional(),

  room: z.string().optional(),

  // --------------------------------
  // General
  // --------------------------------

  title: z.string().trim().min(1, "Title is required"),

  type: z.string().min(1, "Type is required"),

  subtype: z.string().optional(),

  category: z.string().min(1, "Category is required"),

  channel: z.string().min(1, "Channel is required"),

  loc: z.string().optional(),

  locDate: z.string().optional(),

  ppmId: z.string().optional(),

  parentWo: z.string().optional(),

  summary: z.string().optional(),

  priority: z.string().min(1, "Priority is required"),
});
