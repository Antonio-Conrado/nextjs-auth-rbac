import { getTranslations } from "next-intl/server";
import * as z from "zod";

export const changePasswordSchema = async () => {
  const t = await getTranslations();
  return z
    .object({
      id: z.string(),
      currentPassword: z
        .string()
        .nonempty({ error: t("validation.passwordRequired") }),
      newPassword: z
        .string()
        .min(6, { message: t("validation.passwordTooShort") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
          error: t("validation.passwordInvalid"),
        }),

      passwordConfirm: z.string(),
    })
    .refine((data) => data.newPassword === data.passwordConfirm, {
      error: t("validation.passwordsNotMatch"),
      path: ["passwordConfirm"],
    });
};

export type changePassword = z.infer<ReturnType<typeof changePasswordSchema>>;

export type changePasswordErrors = {
  currentPassword?: string[];
  newPassword?: string[];
  passwordConfirm?: string[];
};
