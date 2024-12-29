import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { ExerciseArtType, ExerciseMetricType } from "~/utils/types";

export default function useExercises() {
  return useQuery<ExerciseType[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      const response = await fetch("/api/exercises");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Ausrüstungen");
      return response.json();
    },
  });
}

export function useExerciseStats() {
  return useQuery<ExerciseStatsType[]>({
    queryKey: ["exerciseStats"],
    queryFn: async () => {
      const response = await fetch("/api/exerciseStats");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Exercise Stats");
      return response.json();
    },
  });
}

export const useAddExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEx: {
      name: string;
      category_id: number;
      type: ExerciseArtType;
      metric: ExerciseMetricType;
    }) => {
      const response = await fetch("/api/exercises", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEx),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exerciseStats"] });
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedData,
      categorieIds,
      exercise_id,
    }: {
      updatedData: any;
      categorieIds: number[];
      exercise_id: number;
    }) => {
      if (exercise_id) {
        const response = await fetch("/api/exercises", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exercise_id,
            updatedData,
            categorieIds
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update exercise");
        }

        return exercise_id;
      } else {
        throw new Error("Failed to update exercise");
      }
    },
    onSuccess: (exercise_id: number) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exerciseStats"] });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise_id: number) => {
      const response = await fetch("/api/exercises", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exercise_id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exerciseStats"] });
    },
  });
};
