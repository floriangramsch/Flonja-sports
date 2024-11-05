import { useMutation, useQueryClient } from "@tanstack/vue-query";

export default function useAddExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEx: {
      workout_id: number;
      equip_id: number;
      weight?: string;
    }) => {
      const response = await fetch("/api/addExercise", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEx),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["equips"] });
    },
  });
}
