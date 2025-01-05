import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { NewStatsType } from "~/utils/types";

export function useAddStats() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user_id,
      form,
    }: {
      user_id: number;
      form: NewStatsType;
    }) => {
      const response = await fetch("api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          form,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add stats");
      }

      return response.json();
    },
    onSuccess: () => client.refetchQueries({ queryKey: ["stats"] }),
  });
}

export function useGetStats() {
  return useQuery<UserStatsType>({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
}

export function useGetUserStats(
  user: Ref<{ name?: string; id?: number } | undefined>,
  type: string,
) {
  return useQuery<UserStatsType>({
    queryKey: computed(() => ["stats", user.value?.id, type]),
    queryFn: async () => {
      let response;
      if (user.value?.name === "Florian" || user.value?.name === "Sonja") {
        response = await fetch(`api/stats?type=${type}`);
      } else {
        response = await fetch(`api/stats?id=${user.value?.id}&type=${type}`);
      }
      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }
      return response.json();
    },
    enabled: computed(() => user.value?.id !== undefined),
  });
}

export function useUpdateStats() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      stats_id,
      weight,
    }: {
      stats_id: number;
      weight: number;
    }) => {
      const response = await fetch("api/stats", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stats_id,
          weight,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stats");
      }

      return response.json();
    },
    onSuccess: () => client.refetchQueries({ queryKey: ["stats"] }),
  });
}

export function useDeleteStats() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (stats_id: number) => {
      const response = await fetch("api/stats", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stats_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete stats");
      }

      return response.json();
    },
    onSuccess: () => client.refetchQueries({ queryKey: ["stats"] }),
  });
}
