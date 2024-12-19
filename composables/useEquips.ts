import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { EquipArtType, EquipMetricType } from "~/utils/types";

export default function useEquips() {
  return useQuery<EquipType[]>({
    queryKey: ["equips"],
    queryFn: async () => {
      const response = await fetch("/api/equip");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Ausrüstungen");
      return response.json();
    },
  });
}

export function useExerciseStats() {
  return useQuery<EquipStatsType[]>({
    queryKey: ["equipStats"],
    queryFn: async () => {
      const response = await fetch("/api/equipStats");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Equip Stats");
      return response.json();
    },
  });
}

export const useAddExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEquip: {
      name: string;
      category_id: number;
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

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedData,
      exercise_id,
    }: {
      updatedData: any;
      exercise_id: number;
    }) => {
      if (exercise_id) {
        const response = await fetch("/api/equip", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exercise_id,
            updatedData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update equip");
        }

        return exercise_id;
      } else {
        throw new Error("Failed to update equip");
      }
    },
    onSuccess: (exercise_id: number) => {
      queryClient.invalidateQueries({ queryKey: ["equips"] });
      queryClient.invalidateQueries({ queryKey: ["equipStats"] });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise_id: number) => {
      const response = await fetch("/api/equip", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exercise_id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equips"] });
      queryClient.invalidateQueries({ queryKey: ["equipStats"] });
    },
  });
};
