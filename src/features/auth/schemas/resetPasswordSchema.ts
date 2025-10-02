import { z } from "zod";

export const resetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      resetPasswordToken: z
        .string()
        .nonempty({ error: t("validation.tokenInvalid") }),

      email: z.email({ error: t("validation.emailInvalid") }),

      password: z
        .string()
        .min(6, { message: t("validation.passwordTooShort") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
          error: t("validation.passwordInvalid"),
        }),

      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      error: t("validation.passwordsNotMatch"),
      path: ["passwordConfirm"],
    });

export type resetPasswordForm = z.infer<ReturnType<typeof resetPasswordSchema>>;

export type resetPasswordErrors = {
  resetPasswordToken?: string[];
  email?: string[];
  password?: string[];
  passwordConfirm?: string[];
};
