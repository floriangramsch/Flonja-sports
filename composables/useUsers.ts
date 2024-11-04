import { useQuery } from "@tanstack/vue-query";

export default function useUsers() {
  return useQuery<UserType>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}
