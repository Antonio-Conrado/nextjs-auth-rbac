import { fetchPermissions } from "@/features/security/permissions/api/permissions";
import { fetchUser } from "@/features/security/user/api/user";
import GeneralInformation from "@/features/security/user/components/user/GeneralInformation";
import UserPermissions from "@/features/security/user/components/user/UserPermissions";
import ErrorAlert from "@/shared/components/ui/ErrorAlert";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import Title from "@/shared/components/ui/Title";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: Props) {
  const t = await getTranslations();
  const { id } = await params;
  const user = await fetchUser(+id);
  const permissions = await fetchPermissions();

  if (user.type === "error") return <ErrorAlert message={user.message} />;
  if (permissions.type === "error")
    return <ErrorAlert message={permissions.message} />;

  if (user.data && permissions.data)
    return (
      <div className="container mx-auto py-10">
        <Title title="Perfil del usuario" />
        <div className="flex w-full h-full max-w-full flex-col gap-6">
          <Tabs defaultValue="generalInformation" className="flex-1">
            <TabsList>
              <TabsTrigger value="generalInformation">
                informacion general
              </TabsTrigger>
              <TabsTrigger value="userPermissions">permisos</TabsTrigger>
            </TabsList>
            <div className="w-full border rounded-md p-5">
              <GeneralInformation
                id={user.data.id}
                fullName={user.data.fullName}
                email={user.data.email}
                telephone={user.data.telephone}
                role={user.data.role.name}
                status={user.data.status}
                isAccountConfirmed={user.data.isAccountConfirmed}
                createdAt={user.data.createdAt}
                t={t}
              />
              <UserPermissions />
            </div>
          </Tabs>
        </div>
      </div>
    );
}
