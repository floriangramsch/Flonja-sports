import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useQuery } from "@tanstack/vue-query";

export function useWorkoutExercisesByWorkout(
  workoutId: Ref<number | undefined>,
) {
  return useQuery<WorkoutExerciseType[]>({
    queryKey: computed(() => ["workout_exercises", workoutId.value]),
    queryFn: async () => {
      if (!workoutId.value) throw new Error("Workout Exercises ID is undefined");
      const response = await fetch(
        `/api/workout_exercise?id=${workoutId.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Fehler beim Abrufen der Workout Exercises");
      return response.json();
    },
    enabled: computed(() => workoutId.value !== undefined),
  });
}

export default function useAddWorkoutExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEx: {
      workout_id: number;
      exercise_id: number;
      weight?: string;
    }) => {
      const response = await fetch("/api/workout_exercise", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEx),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout_exercises"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useDeleteWorkoutExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workout_exercise_id: number) => {
      const response = await fetch("/api/workout_exercise", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workout_exercise_id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout_exercises"] });
    },
  });
}
