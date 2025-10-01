"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "../actions/login-actions";
import { initialStateDefault } from "../../../shared/schemas/api/apiResponse.schema";
import { LoginErrors, loginResponse } from "../schemas/loginSchemas";
import ErrorMessage from "@/shared/components/feedback/ErrorMessage";
import { toast } from "sonner";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { redirect } from "next/navigation";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const [checked, setChecked] = useState(false);

  const [state, formAction] = useActionState(
    loginAction,
    initialStateDefault<LoginErrors, loginResponse>()
  );

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      redirect("/dashboard");
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.login.title")}</CardTitle>
          <CardDescription>{t("auth.login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} noValidate>
            <div className="flex flex-col gap-6">
              {/* email */}
              <div className="grid gap-3">
                <Label htmlFor="email">{t("ui.forms.emailLabel")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("ui.forms.emailPlaceholder")}
                  className={state.errors?.email && "border-red-500"}
                  required
                />
                <ErrorMessage errors={state.errors?.email || []} />
              </div>
              {/* password */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    {t("ui.forms.passwordLabel")}
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t("auth.login.links.forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  className={state.errors?.password && "border-red-500"}
                  required
                />

                <ErrorMessage errors={state.errors?.password || []} />
              </div>
              {/* remember  */}
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="remember_me"
                    checked={checked}
                    onCheckedChange={(val) => setChecked(val === true)}
                  />
                  <Label htmlFor="remember_me">
                    {t("ui.forms.rememberMe")}
                  </Label>
                  <input
                    type="hidden"
                    name="remember_me"
                    value={checked ? "true" : "false"}
                  />
                </div>
              </div>
              {/* button */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {t("auth.login.buttons.login")}
                </Button>
                {/* <Button variant="outline" className="w-full">
                  {t("loginWithGoogle")}
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("auth.login.links.signupText")}{" "}
              <Link href="/register" className="underline underline-offset-4">
                {t("auth.login.links.signupLink")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
