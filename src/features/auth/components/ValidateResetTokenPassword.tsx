import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";

import { useTranslations } from "next-intl";
import InputForm from "@/shared/components/forms/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/config/axios";
import { API_URL } from "@/lib/const/environments";
import { apiAxiosError } from "@/shared/utils/networkError";
import { toast } from "sonner";
import { apiResponseSchema } from "@/shared/schemas/api/apiResponse.schema";
import { Dispatch, SetStateAction } from "react";

export const getValidateTokenSchema = (t: (key: string) => string) =>
  z.object({
    resetPasswordToken: z
      .string()
      .nonempty({ error: t("validation.tokenInvalid") }),
  });
type ValidateTokenForm = z.infer<ReturnType<typeof getValidateTokenSchema>>;

type Props = {
  email: string;
  setIsValidToken: Dispatch<SetStateAction<boolean>>;
  setResetPasswordToken: Dispatch<SetStateAction<string>>;
};

export function ValidateResetTokenPassword({
  email,
  setIsValidToken,
  setResetPasswordToken,
}: Props) {
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidateTokenForm>({
    resolver: zodResolver(getValidateTokenSchema(t)),
  });

  const onSubmit = async (data: ValidateTokenForm) => {
    const { resetPasswordToken } = data;
    try {
      const { data } = await api.post(
        `${API_URL}/auth/validate-reset-token-password`,
        {
          email,
          resetPasswordToken,
        }
      );
      // validate the response with the apiResponse schema
      const result = apiResponseSchema(z.null()).safeParse(data);
      if (!result.success) {
        setIsValidToken(false);
      }
      // if the request is successful, return via props that the token is valid so the reset password form can be used
      if (result.data && result.data.type === "success") {
        setIsValidToken(true);
        setResetPasswordToken(resetPasswordToken);
        toast.success(result.data.message);
      }
    } catch (error) {
      const result = await apiAxiosError(error);
      // show the error
      toast.error(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.verifyToken.title")}</CardTitle>
          <CardDescription>{t("auth.verifyToken.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              {/* token */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="resetPasswordToken"
                  placeholder={t("ui.forms.tokenPlaceholder")}
                  label={t("ui.forms.tokenLabel")}
                />
              </div>

              {/* button */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {t("auth.verifyToken.buttons.verify")}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm flex">
              <div>
                {t("auth.register.links.haveAccount")} {""}
                <Link href="/login" className="underline underline-offset-4">
                  {t("auth.register.links.loginLink")}
                </Link>
              </div>

              <div className="text-center text-sm">
                {t("auth.login.links.signupText")}{" "}
                <Link href="/register" className="underline underline-offset-4">
                  {t("auth.login.links.signupLink")}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
