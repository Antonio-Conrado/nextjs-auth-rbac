import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { TabsContent } from "@/shared/components/ui/tabs";
import { formatDate } from "@/shared/utils/formatDate";
import { User } from "lucide-react";

type Props = {
  id: number;
  fullName: string;
  email: string;
  telephone: string;
  role: string;
  status: boolean;
  isAccountConfirmed: boolean;
  createdAt: string;
  t: (key: string) => string;
};

export default function GeneralInformation({
  id,
  fullName,
  email,
  telephone,
  role,
  status,
  isAccountConfirmed,
  createdAt,
  t,
}: Props) {
  return (
    <>
      <TabsContent value="generalInformation" className="flex-1 pt-4">
        <div className="flex gap-2 mb-5">
          <User />
          <h3> {t("ui.users.user.titleAccountInformation")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-3">
            <Label htmlFor="id">{t("ui.users.usersList.table.id")}</Label>
            <Input id="id" value={id} readOnly />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="fullName">
              {t("ui.users.usersList.table.fullName")}
            </Label>
            <Input id="fullName" value={fullName} readOnly />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">{t("ui.users.usersList.table.role")}</Label>
            <Input id="role" value={role} readOnly />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="createdAt">Fecha de creacion</Label>
            <Input id="createdAt" value={formatDate(createdAt)} readOnly />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="isAccountConfirmed">
              {t("ui.users.user.verifiedAccount")}
            </Label>
            <Input
              id="status"
              value={isAccountConfirmed ? t("ui.yes") : t("ui.no")}
              readOnly
              className={` dark:text-white ${
                status ? "text-green-600 " : "text-red-500"
              }`}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="status">
              {t("ui.users.usersList.table.status")}
            </Label>
            <Input
              id="status"
              value={status ? t("ui.status.active") : t("ui.status.inactive")}
              readOnly
              className={
                status ? "bg-green-600 text-white" : "bg-gray-800 text-white"
              }
            />
          </div>
        </div>

        {/* contact information */}
        <div className="flex gap-2 mt-10 mb-5">
          <User />
          <h3> {t("ui.users.user.contactData")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">{t("ui.users.usersList.table.email")}</Label>
            <Input id="email" value={email} readOnly />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="telephone">
              {t("ui.users.usersList.table.telephone")}
            </Label>
            <Input id="telephone" value={telephone} readOnly />
          </div>
        </div>
      </TabsContent>
    </>
  );
}
