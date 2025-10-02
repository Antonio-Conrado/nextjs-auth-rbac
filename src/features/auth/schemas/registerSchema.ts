import { z } from "zod";

export const registerFormDataSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    surname: z.string().min(1, t("validation.surnameRequired")),
    telephone: z
      .string()
      .regex(/^\+505[578]\d{7}$/, {
        message: t("validation.telephoneInvalid"),
      })
      .optional(),
    email: z.email({ message: t("validation.emailInvalid") }),
    password: z
      .string()
      .min(6, t("validation.passwordTooShort"))
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message: t("validation.passwordInvalid"),
      }),
  });

export type registerFormData = z.infer<
  ReturnType<typeof registerFormDataSchema>
>;

export type registerErrors = {
  name?: string[];
  surname?: string[];
  telephone?: string[];
  email?: string[];
  password?: string[];
};
