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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { profile, profileErrors, profileSchema } from "../schemas/profile";
import InputForm from "@/shared/components/forms/FormInput";
import { startTransition, useActionState, useEffect } from "react";
import { profileAction } from "../actions/profile-action";
import { initialStateDefault } from "@/shared/schemas/api/apiResponse.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import ErrorMessage from "@/shared/components/feedback/ErrorMessage";
import { useRouter } from "next/navigation";

export default function Profile() {
  const t = useTranslations();
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  // Pass `user.id` as an additional argument to the server action.
  const updateProfileWithId = profileAction.bind(null, user?.id);
  const [state, formAction] = useActionState(
    updateProfileWithId,
    initialStateDefault<profileErrors, null>()
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<profile>({
    resolver: zodResolver(profileSchema(t)),
  });

  // Populate the form fields with default values from the user store whenever the user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        surname: user.surname,
        email: user.email,
        telephone: user.telephone,
        roleId: user.role.id,
      });
    }
  }, [user, reset]);

  // Handle API response
  useEffect(() => {
    if (state.type === "success") {
      // Refresh the page to fetch the updated user profile and update the user in the store
      router.refresh();
      toast.success(state.message);
    } else if (state.type === "error") {
      // Show error message if the update failed
      toast.error(state.message);
    }
  }, [state, router]);

  const onSubmit = (data: profile) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "roleId") {
        // Skip roleId because it can only be edited in the Security module
        formData.append(key, value as string);
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  if (!user) return null;

  return (
    <TabsContent value="profile" className="flex-1">
      <Card className="w-full h-full  flex flex-col">
        <CardHeader>
          <CardTitle>{t("ui.settings.profile.title")}</CardTitle>
          <CardDescription>
            {t("ui.settings.profile.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <InputForm
                register={register}
                errors={errors}
                name="name"
                label={t("ui.forms.nameLabel")}
                placeholder={t("ui.forms.namePlaceholder")}
              />{" "}
              <ErrorMessage errors={state.errors?.name || []} />
            </div>
            <div className="grid gap-3">
              <InputForm
                register={register}
                errors={errors}
                name="surname"
                label={t("ui.forms.surnameLabel")}
                placeholder={t("ui.forms.surnamePlaceholder")}
              />
            </div>
            <div className="grid gap-3">
              <InputForm
                register={register}
                errors={errors}
                name="email"
                label={t("ui.forms.emailLabel")}
                placeholder={t("ui.forms.emailPlaceholder")}
              />
            </div>
            <div className="grid gap-3">
              <InputForm
                register={register}
                errors={errors}
                name="telephone"
                label={t("ui.forms.telephoneLabel")}
                placeholder={t("ui.forms.telephonePlaceholder")}
              />
            </div>

            <div className="grid gap-3">
              <Label>{t("ui.forms.roleLabel")}</Label>
              <Select value={String(user.role.id)} disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("ui.forms.rolePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(user.role.id)}>
                    {user.role.name}
                  </SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage errors={state.errors?.roleId || []} />
            </div>
          </CardContent>
          <CardFooter className="my-4">
            <Button type="submit">{t("ui.settings.profile.buttons")}</Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
