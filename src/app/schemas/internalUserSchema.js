import { z } from "zod";

const codePattern = /^[A-Za-z0-9_-]+$/;

export const internalUserSchema = z.object({
  roleCode: z
    .string()
    .trim()
    .min(1, "Role Code is required")
    .max(20, "Role Code must be 20 characters or less")
    .regex(codePattern, "Use letters, numbers, - or _ only"),

  roleName: z
    .string()
    .trim()
    .min(1, "Role Name is required"),

  roleAccessCode: z
    .string()
    .trim()
    .min(1, "Role Access Code is required")
    .max(20, "Role Access Code must be 20 characters or less")
    .regex(codePattern, "Use letters, numbers, - or _ only"),

  roleAccessName: z
    .string()
    .trim()
    .min(1, "Role Access Name is required"),
});
