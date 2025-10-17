import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toogleStatusUser } from "../api/user";
import { toast } from "sonner";

/**
 * Hook for toggling the status of a user (active/inactive) in the security module.
 */
export default function useToggleUserStatus() {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (id: number) => toogleStatusUser(id),
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(success) {
      toast.success(success.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const toogleStatus = (id: number) => {
    mutate.mutate(id);
  };

  return { toogleStatus };
}
