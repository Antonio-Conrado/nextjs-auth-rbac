import { useAppStore } from "@/store/useStore";

export function hasPermission(permission: string): boolean {
  const { user } = useAppStore.getState();
  console.log(user?.role.permissions);
  return !!user?.role.permissions.find((p) => p.name === permission);
}
