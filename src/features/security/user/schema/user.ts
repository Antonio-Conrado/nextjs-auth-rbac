import { userProfileSchema } from "@/features/auth/schemas/profileSchema";
import { z } from "zod";

export const usersProfileArraySchema = z.array(userProfileSchema);
export type UsersProfileArray = z.infer<typeof usersProfileArraySchema>;

export const usersListProfileSchema = (t: (key: string) => string) =>
  z.object({
    id: z.number({ error: t("validation.idRequired") }),
    fullName: z.string({ error: t("validation.nameRequired") }),
    email: z.email({ error: t("validation.emailInvalid") }),
    profilePhotoUrl: z
      .string({
        error: t("validation.imageRequired"),
      })
      .nullable(),
    roleName: z.string({ error: t("validation.roleRequired") }),
    telephone: z
      .string()
      .regex(/^\+505[578]\d{7}$/, { error: t("validation.telephoneInvalid") })
      .nullable(),
    status: z.boolean({ error: t("validation.statusRequired") }),
  });

export type usersListProfile = z.infer<
  ReturnType<typeof usersListProfileSchema>
>;
