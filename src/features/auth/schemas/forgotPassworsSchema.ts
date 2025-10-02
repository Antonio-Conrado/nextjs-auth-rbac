import { z } from "zod";

export const forgotPasswordFormSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email({ message: t("validation.emailInvalid") }),
  });

export type forgotPasswordForm = z.infer<
  ReturnType<typeof forgotPasswordFormSchema>
>;

export type forgotPasswordErrors = {
  email?: string[];
};
