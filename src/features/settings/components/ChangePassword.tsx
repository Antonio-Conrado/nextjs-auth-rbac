"use client";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TabsContent } from "@/shared/components/ui/tabs";
import { useAppStore } from "@/store/useStore";
import { useTranslations } from "next-intl";
import { changePasswordErrors } from "../schemas/changePassword";
import { useActionState, useEffect } from "react";
import { changePasswordAction } from "../actions/changePassword-action";
import { initialStateDefault } from "@/shared/schemas/api/apiResponse.schema";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import ErrorMessage from "@/shared/components/feedback/ErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/api/auth";

export default function ChangePassword() {
  const t = useTranslations("");
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const [state, formAction] = useActionState(
    changePasswordAction,
    initialStateDefault<changePasswordErrors, null>()
  );

  useEffect(() => {
    if (state.type === "success") {
      const handleLogoutAfterPasswordChange = async function () {
        const result = await logout();
        if (result.type === "success") {
          router.push("/login");
          clearAuth();
        }
      };
      handleLogoutAfterPasswordChange();
    }
  }, [state, router, clearAuth]);

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state, router, clearAuth]);

  if (!user) return null;
  return (
    <TabsContent value="changePassword" className="flex-1">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>{t("ui.settings.changePassword.title")}</CardTitle>
          <CardDescription>
            {t("ui.settings.changePassword.description")}
          </CardDescription>
        </CardHeader>
        <form action={formAction} noValidate>
          <CardContent className="grid gap-6">
            <input type="hidden" name="id" value={user.id} />
            <div className="grid gap-3">
              <Label htmlFor="currentPassword">
                {t("ui.forms.passwordLabel")}
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder={t("ui.forms.passwordPlaceholder")}
                className={state.errors?.currentPassword && "border-red-500"}
                required
              />
              <ErrorMessage errors={state.errors?.currentPassword || []} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="newPassword">
                {t("ui.forms.newPasswordLabel")}
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder={t("ui.forms.newPasswordPlaceholder")}
                className={state.errors?.newPassword && "border-red-500"}
                required
              />
              <ErrorMessage errors={state.errors?.newPassword || []} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="passwordConfirm">
                {t("ui.forms.passwordConfirmLabel")}
              </Label>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder={t("ui.forms.passwordConfirmPlaceholder")}
                className={state.errors?.passwordConfirm && "border-red-500"}
                required
              />
              <ErrorMessage errors={state.errors?.passwordConfirm || []} />
            </div>
          </CardContent>
          <CardFooter className="my-4">
            <Button type="submit" className="hover:cursor-pointer">
              {t("ui.settings.changePassword.buttons")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
