import { permissionSchema } from "@/features/auth/schemas/profileSchema";
import { z } from "zod";

export const PermissionsArraySchema = z.array(permissionSchema);
export type PermissionsArray = z.infer<typeof PermissionsArraySchema>;
