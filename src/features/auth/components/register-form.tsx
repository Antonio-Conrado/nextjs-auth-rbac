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
import { registerAction } from "../actions/register-actions";
import { initialStateDefault } from "@/shared/schemas/api/apiResponse.schema";
import { toast } from "sonner";
import {
  registerErrors,
  registerFormData,
  registerFormDataSchema,
} from "../schemas/registerSchema";

export function RegisterForm({
  className,

  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const [state, formAction] = useActionState(
    registerAction,
    initialStateDefault<registerErrors, null>()
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<registerFormData>({
    resolver: zodResolver(registerFormDataSchema(t)),
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
          setError(field as keyof registerFormData, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }
  }, [state, setError]);

  const onSubmit = (data: registerFormData) => {
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
          <CardTitle>{t("auth.register.title")}</CardTitle>
          <CardDescription>{t("auth.register.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              {/* name */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="name"
                  placeholder={t("ui.forms.namePlaceholder")}
                  label={t("ui.forms.nameLabel")}
                />
              </div>

              {/* surname */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="surname"
                  placeholder={t("ui.forms.surnamePlaceholder")}
                  label={t("ui.forms.surnameLabel")}
                />
              </div>

              {/* telephone */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="telephone"
                  placeholder={t("ui.forms.telephonePlaceholder")}
                  label={t("ui.forms.telephoneLabel")}
                />
              </div>

              {/* email */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="email"
                  type="email"
                  placeholder={t("ui.forms.emailPlaceholder")}
                  label={t("ui.forms.emailLabel")}
                />
              </div>

              {/* password */}
              <div className="grid gap-3">
                <InputForm
                  register={register}
                  errors={errors}
                  name="password"
                  placeholder={t("ui.forms.passwordPlaceholder")}
                  label={t("ui.forms.passwordLabel")}
                />
              </div>

              {/* button */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {t("auth.register.buttons.register")}
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

              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                {t("auth.login.links.forgotPassword")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
