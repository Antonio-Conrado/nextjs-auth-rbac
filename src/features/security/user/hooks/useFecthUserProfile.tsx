import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/user";

type Props = {
  selectedUserId: number | null;
};

export default function useFecthUserProfile({ selectedUserId }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => fetchUser(selectedUserId!),
    enabled: selectedUserId !== null,
    staleTime: 1000 * 60,
  });
  return { data, isLoading, error };
}
