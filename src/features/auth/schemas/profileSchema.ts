import * as z from "zod";

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.boolean(),
});

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.boolean(),
  permissions: z.array(permissionSchema),
});

export const userProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  fullName: z.string(),
  email: z.string(),
  telephone: z.string(),
  profilePhotoUrl: z.string().nullable(),
  isAccountConfirmed: z.boolean(),
  status: z.boolean(),
  createdAt: z.string(),
  role: roleSchema,
});
export type Permission = z.infer<typeof permissionSchema>;
export type Role = z.infer<typeof roleSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

export type keyToken = "refreshToken" | "rememberToken";
