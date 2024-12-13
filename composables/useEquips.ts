import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { EquipArtType, EquipMetricType } from "~/utils/types";

export default function useEquips() {
  return useQuery<EquipType[]>({
    queryKey: ["equips"],
    queryFn: fetchEquipment,
  });
}

export function useEquipStats() {
  return useQuery<EquipStatsType[]>({
    queryKey: ["equipStats"],
    queryFn: fetchEquipStats,
  });
}

export const useAddEquips = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEquip: {
      name: string;
      muscleGroupId: number;
      type: EquipArtType;
      metric: EquipMetricType;
    }) => {
      const response = await fetch("/api/equip", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEquip),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equips"] });
      queryClient.invalidateQueries({ queryKey: ["equipStats"] });
    },
  });
};

export const useUpdateEquip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedData,
      equip_id,
    }: {
      updatedData: any;
      equip_id: number;
    }) => {
      if (equip_id) {
        const response = await fetch("/api/equip", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            equip_id,
            updatedData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update equip");
        }

        return equip_id;
      } else {
        throw new Error("Failed to update equip");
      }
    },
    onSuccess: (equip_id: number) => {
      queryClient.invalidateQueries({ queryKey: ["equips"] });
      queryClient.invalidateQueries({ queryKey: ["equipStats"] });
    },
  });
};

export const useDeleteEquip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (equip_id: number) => {
      const response = await fetch("/api/equip", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ equip_id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equips"] });
      queryClient.invalidateQueries({ queryKey: ["equipStats"] });
    },
  });
};
