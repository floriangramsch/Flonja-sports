import { useMutation, useQueryClient } from "@tanstack/vue-query";

export default function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workout_exercise_id: number) => {
      const response = await fetch("/api/exercise", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workout_exercise_id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["equips"] });
      queryClient.invalidateQueries({ queryKey: ["workout_exercises"] });
    },
  });
}
