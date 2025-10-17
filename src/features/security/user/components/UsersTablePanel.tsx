"use client";

import { useState } from "react";
import { DataTable } from "@/shared/components/tables/DataTable";
import {
  initialMetaDefault,
  paginationData,
} from "@/shared/schemas/pagination";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/features/security/user/api/user";
import { SpinnerButton } from "@/shared/components/ui/spinnerButton";
import { UserTableRow } from "@/features/security/user/components/UserTableRow";
import UserForm from "@/features/security/user/components/UserForm";
import { usersListProfile } from "@/features/security/user/schema/user";
import { useTranslations } from "next-intl";
import DataPanel from "@/shared/components/tables/DataPanel";
import { Input } from "@/shared/components/ui/input";
import Title from "@/shared/components/ui/Title";
import useSearchTerm from "@/shared/hooks/useSeachTerm";
import ErrorAlert from "@/shared/components/ui/ErrorAlert";
import { apiResponse } from "@/shared/schemas/api/apiResponse.schema";

type Props = {
  initialData: apiResponse<paginationData<usersListProfile> | null>;
};

export default function UsersTablePanel({ initialData }: Props) {
  const t = useTranslations();
  const [meta, setMeta] = useState(initialMetaDefault);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { searchText, debouncedText, handleSearch } = useSearchTerm();

  // Translations for the columns of the users table
  const columns = [
    t("ui.users.usersList.table.id"),
    t("ui.users.usersList.table.email"),
    t("ui.users.usersList.table.fullName"),
    t("ui.users.usersList.table.profilePhotoUrl"),
    t("ui.users.usersList.table.role"),
    t("ui.users.usersList.table.telephone"),
    t("ui.users.usersList.table.status"),
    "",
  ];

  // Fetch the list of users
  const { data, isLoading } = useQuery({
    queryKey: ["users", meta.page, debouncedText],
    queryFn: () => {
      if (debouncedText) {
        // If a search term exists, pass it as an identifier to reuse the same function for filtered results
        return fetchUsers({
          term: debouncedText,
          page: meta.page,
          limit: meta.limit,
          t,
        });
      }
      // If there is no search term, fetch the full paginated list of users
      return fetchUsers({ page: meta.page, limit: meta.limit, t });
    },

    staleTime: 1000 * 60 * 5,
    placeholderData: initialData,
  });

  // Open dialog to update user
  const handleUpdateUser = (id: number) => {
    setSelectedUserId(id);
    setIsDialogOpen(true);
  };

  if (isLoading) return <SpinnerButton />;
  if (data && data.type === "error")
    return <ErrorAlert message={data.message} />;

  if (data && data.data)
    return (
      <div className="container mx-auto py-10">
        <Title title={t("ui.users.usersList.title")} />
        <DataPanel>
          <>
            <div className="flex items-center py-4">
              <Input
                placeholder={t("ui.users.search.placeholder")}
                value={searchText}
                onChange={(event) => handleSearch(event.target.value)}
                className="max-w-sm"
              />
            </div>
            {/* Users table */}
            <DataTable
              data={data.data.items}
              meta={data.data.meta}
              columns={columns}
              onPageChange={(page) => setMeta((prev) => ({ ...prev, page }))}
              renderRow={(user: usersListProfile) => (
                <UserTableRow user={user} handleViewUser={handleUpdateUser} />
              )}
            />
          </>
        </DataPanel>
        {/* If handleUpdateUser is triggered, show the user form */}
        <UserForm
          open={isDialogOpen}
          onOpenChange={(open) => setIsDialogOpen(open)}
          selectedUserId={selectedUserId}
        />
      </div>
    );
}
