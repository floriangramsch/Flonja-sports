import { useQuery } from "@tanstack/vue-query";

export function useExercisesByWorkout(workoutId: Ref<number | undefined>) {
  return useQuery<ExerciseType[]>({
    queryKey: computed(() => ["workout_exercises", workoutId.value]),
    queryFn: async () => {
      if (!workoutId.value) throw new Error("Exercises ID is undefined");
        const response = await fetch("/api/getExercisesByWorkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: workoutId.value }),
        });
        if (!response.ok) throw new Error("Fehler beim Abrufen der Exercises");
        return response.json();
    },
    enabled: computed(() => workoutId.value !== undefined),
  });
}
