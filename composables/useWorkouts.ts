import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export default function useWorkouts() {
  return useQuery<WorkoutType[]>({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });
}
export function useGetWorkout(workoutId: Ref<number | undefined>) {
  return useQuery<WorkoutType>({
    queryKey: computed(() => ["workout", workoutId.value]),
    queryFn: () => {
      if (!workoutId.value) throw new Error("Workout ID is undefined");
      return fetchWorkout(workoutId.value);
    },
    enabled: computed(() => workoutId.value !== undefined),
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

export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedData,
      workout_id,
    }: {
      updatedData: any;
      workout_id: number;
    }) => {
      if (workout_id) {
        const response = await fetch("/api/workout", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workout_id,
            updatedData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add workout");
        }

        return workout_id;
      } else {
        throw new Error("Failed to update workout");
      }
    },
    onSuccess: (workout_id: number) => {
      queryClient.invalidateQueries({ queryKey: ["workout", workout_id] });
    },
  });
};
