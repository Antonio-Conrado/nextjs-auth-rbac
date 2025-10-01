import { getTranslations } from "next-intl/server";
import { z } from "zod";
export const loginSchema = async () => {
  const t = await getTranslations("validation");
  return z.object({
    email: z.email({ error: t("emailInvalid") }),
    password: z.string().nonempty({ error: t("passwordRequired") }),
    remember_me: z
      .string()
      .optional()
      .transform((value) => value === "true"),
  });
};
export type login = z.infer<typeof loginSchema>;

export type LoginErrors = {
  email?: string[];
  password?: string[];
  remember_me?: boolean;
};

//api
export const loginResponseSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.uuidv4(),
  rememberToken: z.uuidv4().nullable(),
});
export type loginResponse = z.infer<typeof loginResponseSchema>;

export const accessTokenSchema = z.object({
  accessToken: z.jwt(),
});
export type accessToken = z.infer<typeof accessTokenSchema>;
