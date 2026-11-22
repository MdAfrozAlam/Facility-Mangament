import { z } from "zod";

export const internalUserAccessSchema = z.object({
  role: z.string().trim().min(1, "Role is required"),
  roleAccess: z.string().trim().min(1, "Role Access is required"),
});
