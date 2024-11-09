import { useQuery } from "@tanstack/vue-query";

export function useExercisesByWorkout(workoutId: Ref<number | undefined>) {
  return useQuery<any>({
    queryKey: computed(() => ["exercises", workoutId.value]),
    queryFn: () => {
      if (!workoutId.value) throw new Error("Exercises ID is undefined");
      return fetchExercisesByWorkout(workoutId.value);
    },
    enabled: computed(() => workoutId.value !== undefined),
  });
}
