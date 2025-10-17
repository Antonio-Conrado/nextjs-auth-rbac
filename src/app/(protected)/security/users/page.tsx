import { fetchUsers } from "@/features/security/user/api/user";
import UsersTablePanel from "@/features/security/user/components/UsersTablePanel";
import ErrorAlert from "@/shared/components/ui/ErrorAlert";

import { initialMetaDefault } from "@/shared/schemas/pagination";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations();
  const data = await fetchUsers({
    page: initialMetaDefault.page,
    limit: initialMetaDefault.limit,
    t,
  });

  if (data.type === "error") return <ErrorAlert message={data.message} />;
  return <UsersTablePanel initialData={data} />;
}
