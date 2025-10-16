import * as z from "zod";

export const profileSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().nonempty({ error: t("validation.nameRequired") }),
    surname: z.string().nonempty({ error: t("validation.surnameRequired") }),
    email: z.email({ message: t("validation.emailInvalid") }),
    telephone: z
      .string()
      .regex(/^\+505[578]\d{7}$/, {
        message: t("validation.telephoneInvalid"),
      })
      .optional(),
    roleId: z.number({ error: t("validation.roleRequired") }).optional(),
  });
};
export type profile = z.infer<ReturnType<typeof profileSchema>>;

export type profileErrors = {
  name?: string[];
  surname?: string[];
  email?: string[];
  telephone?: string[];
  roleId?: string[];
};
