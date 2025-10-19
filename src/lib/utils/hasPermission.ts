import { useAppStore } from "@/store/useStore";

export function hasPermission(permission: string): boolean {
  const { user } = useAppStore.getState();
  return !!user?.role.permissions.find(
    (p) => p.name === permission || p.name === "super.admin.fullAccess"
  );
}
