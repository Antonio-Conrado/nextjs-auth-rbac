import { roleSchema } from "@/features/auth/schemas/profileSchema";
import { z } from "zod";

export const rolesArraySchema = z.array(roleSchema);
export type rolesArray = z.infer<typeof rolesArraySchema>;
