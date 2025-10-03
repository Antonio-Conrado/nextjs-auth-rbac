import { Button } from "@/shared/components/ui/button";
import { startTransition, useActionState, useEffect } from "react";
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
import { toast } from "sonner";
import { initialStateDefault } from "@/shared/schemas/api/apiResponse.schema";
import {
  resetPasswordErrors,
  resetPasswordForm,
  resetPasswordSchema,
} from "../schemas/resetPasswordSchema";
import { resetPasswordAction } from "../actions/resetPassword-action";
import { useRouter } from "next/navigation";

type Props = {
  email: string;
  resetPasswordToken: string;
};

export function ResetPasswordForm({ email, resetPasswordToken }: Props) {
  const router = useRouter();
  const t = useTranslations();
  const [state, formAction] = useActionState(
    resetPasswordAction,
    initialStateDefault<resetPasswordErrors, null>()
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<resetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      // Set default values so the form has the email and token pre-filled,
      // avoiding the need for hidden inputs or empty initial state.
      email,
      resetPasswordToken,
    },
  });
  useEffect(() => {
    // Show toast notifications when the request is completed
    if (state.type === "success") {
      toast.success(state.message);
      router.push("/login");
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    // Handle server-side validation errors (in case client-side validation is bypassed)
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          setError(field as keyof resetPasswordForm, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }
  }, [state, setError]);

  const onSubmit = (data: resetPasswordForm) => {
    // Prepare form data to send to the server
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    // Use startTransition to keep UI responsive while submitting
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.resetPassword.title")}</CardTitle>
          <CardDescription>
            {t("auth.resetPassword.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              {/* password */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="password"
                  placeholder={t("ui.forms.newPasswordPlaceholder")}
                  label={t("ui.forms.newPasswordLabel")}
                  type="password"
                />
              </div>

              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="passwordConfirm"
                  placeholder={t("ui.forms.passwordConfirmPlaceholder")}
                  label={t("ui.forms.passwordConfirmLabel")}
                  type="password"
                />
              </div>

              {/* button */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full hover:cursor-pointer">
                  {t("auth.resetPassword.buttons.reset")}
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
