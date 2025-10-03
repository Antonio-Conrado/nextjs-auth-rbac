import ChangePassword from "@/features/settings/components/ChangePassword";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations();
  return (
    <div className="flex w-full h-full max-w-full flex-col gap-6">
      <Tabs defaultValue="profile" className="flex-1">
        <TabsList>
          <TabsTrigger value="profile">
            {t("ui.settings.profile.tabsTitle")}
          </TabsTrigger>
          <TabsTrigger value="changePassword">
            {" "}
            {t("ui.settings.changePassword.tabsTitle")}
          </TabsTrigger>
        </TabsList>
        <ChangePassword />
      </Tabs>
    </div>
  );
}
