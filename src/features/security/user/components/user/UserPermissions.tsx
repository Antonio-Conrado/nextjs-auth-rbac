"use client";
import { TabsContent } from "@radix-ui/react-tabs";
import { PermissionsArray } from "../../../permissions/schema/permissions";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  userPermissions: PermissionsArray;
  permissions: PermissionsArray;
};
export default function UserPermissions({
  permissions,
  userPermissions,
}: Props) {
  const t = useTranslations();
  return (
    <>
      <TabsContent value="userPermissions" className="flex-1 pt-4">
        <div className="flex gap-2 mb-5">
          <Lock />
          <h3> {t("ui.users.user.titlePermissionsAndAccessControl")}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {permissions.map((permission) => {
            // Checks if the user has this permission
            const userHasPermission = userPermissions.some(
              (userPermission) =>
                userPermission.id === permission.id && userPermission.status
            );

            return (
              <div key={permission.id} className="flex items-center space-x-2">
                <Switch
                  id={permission.name}
                  checked={userHasPermission}
                  onCheckedChange={() => {}}
                />
                <Label htmlFor={permission.name}>
                  {permission.description}
                </Label>
              </div>
            );
          })}
        </div>
      </TabsContent>
    </>
  );
}
