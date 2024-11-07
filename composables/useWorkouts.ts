import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export default function useWorkouts() {
  return useQuery<WorkoutType>({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });
}

export const useAddWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch("/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add workout");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};
