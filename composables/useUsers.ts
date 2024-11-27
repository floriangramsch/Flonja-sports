import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export default function useUsers() {
  return useQuery<UserType>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

export function useUpdateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user_id,
      rest_time,
    }: {
      user_id: number;
      rest_time: number;
    }) => {
      const response = await fetch("api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          rest_time,
        }),
      });
    },
    onSuccess: () => {
      client.refetchQueries({ queryKey: ["workout"] });
    },
  });
}
