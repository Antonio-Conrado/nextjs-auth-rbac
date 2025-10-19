import { TableCell } from "@/shared/components/ui/table";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { hasPermission } from "@/lib/utils/hasPermission";
import { usersListProfile } from "../schema/user";
import useToggleUserStatus from "../hooks/useToggleUserStatus";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  user: usersListProfile;
  handleViewUser: (id: number) => void;
};

export function UserTableRow({ user, handleViewUser }: Props) {
  const t = useTranslations();
  const { toogleStatus } = useToggleUserStatus();

  return (
    <>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.fullName}</TableCell>
      <TableCell className="flex justify-center">
        <Image
          src={user.profilePhotoUrl || "/logo.png"}
          alt={user.fullName}
          height={30}
          width={30}
        />
      </TableCell>
      <TableCell>{user.roleName}</TableCell>
      <TableCell>{user.telephone}</TableCell>
      <TableCell>
        {user.status ? t("ui.status.active") : t("ui.status.inactive")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("ui.actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hasPermission("user.readOne") && (
              <DropdownMenuItem>
                <Link href={`/security/users/${user.id}`}>
                  {t("ui.viewDetails")}
                </Link>
              </DropdownMenuItem>
            )}
            {hasPermission("user.update") && (
              <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                {t("ui.update")}
              </DropdownMenuItem>
            )}

            {hasPermission("user.toggleStatus") && (
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => toogleStatus(user.id)}
              >
                {user.status === true ? t("ui.suspend") : t("ui.active")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </>
  );
}
