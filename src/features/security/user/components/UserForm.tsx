import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { SpinnerButton } from "@/shared/components/ui/spinnerButton";
import { toast } from "sonner";
import InputForm from "@/shared/components/forms/FormInput";
import { useTranslations } from "next-intl";
import ErrorMessage from "@/shared/components/feedback/ErrorMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import useUpdateUser from "../hooks/useUpdateUserProfile";
import { useQuery } from "@tanstack/react-query";
import { fetchRoles } from "../../roles/api/roles";
import { Controller } from "react-hook-form";
import useFecthUserProfile from "../hooks/useFecthUserProfile";
import { DialogTitle } from "@radix-ui/react-dialog";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserId: number | null;
}

export default function UserForm({
  open,
  onOpenChange,
  selectedUserId,
}: UserFormProps) {
  const t = useTranslations();
  const { data, isLoading, error } = useFecthUserProfile({ selectedUserId });

  const { handleSubmit, register, errors, control, onSubmit, state } =
    useUpdateUser({
      selectedUserId,
      data: data?.data,
      t,
    });

  // Fetch roles to populate the role select field
  const roles = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  if (isLoading || roles.isLoading) return <SpinnerButton />;
  if (error) {
    toast.error(error.message);
    return null;
  }
  const rolesData = roles.data?.data || [];

  if (data?.data && rolesData)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid gap-6"
          >
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
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("ui.forms.rolePlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesData.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage errors={state.errors?.roleId || []} />
            </div>
            <DialogFooter>
              <Button type="submit">{t("ui.update")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
}
