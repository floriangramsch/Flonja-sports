import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { StatsType } from "~/utils/types";

export function useAddStats() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user_id,
      weight,
    }: {
      user_id: number;
      weight: number;
    }) => {
      const response = await fetch("api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          weight,
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
  return useQuery<StatsType[]>({
    queryKey: ["stats"],
    queryFn: fetchStats,
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
