"use client";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import InputForm from "@/shared/components/forms/FormInput";
import { startTransition, useActionState, useEffect } from "react";
import { initialStateDefault } from "@/shared/schemas/api/apiResponse.schema";
import { toast } from "sonner";
import { forgotPasswordAction } from "../actions/forgotPassword-action";
import {
  forgotPasswordErrors,
  forgotPasswordForm,
  forgotPasswordFormSchema,
} from "../schemas/forgotPassworsSchema";

export function ForgotPasswordForm({
  className,

  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const [state, formAction] = useActionState(
    forgotPasswordAction,
    initialStateDefault<forgotPasswordErrors, null>()
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<forgotPasswordForm>({
    resolver: zodResolver(forgotPasswordFormSchema(t)),
  });

  useEffect(() => {
    // Show toast notifications when the request is completed
    if (state.type === "success") {
      toast.success(state.message);
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    // Handle server-side validation errors (in case client-side validation is bypassed)
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          setError(field as keyof forgotPasswordForm, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }
  }, [state, setError]);

  const onSubmit = (data: forgotPasswordForm) => {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.forgotPassword.title")}</CardTitle>
          <CardDescription>
            {t("auth.forgotPassword.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              {/* name */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="email"
                  placeholder={t("ui.forms.emailPlaceholder")}
                  label={t("ui.forms.emailLabel")}
                />
              </div>

              {/* button */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full hover:cursor-pointer">
                  {t("auth.forgotPassword.buttons.send")}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm flex gap-3">
              <div>
                {t("auth.register.links.haveAccount")} {""}
                <Link href="/login" className="underline underline-offset-4">
                  {t("auth.register.links.loginLink")}
                </Link>
              </div>

              <div>
                {t("auth.login.links.signupText")} {""}
                <Link href="/login" className="underline underline-offset-4">
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
