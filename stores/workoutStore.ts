// stores/workoutStore.ts
import { defineStore } from "pinia";
import { useQuery } from "@tanstack/vue-query";

export const useWorkoutStore = defineStore("workout", () => {
  const workoutId = ref<number | undefined>(undefined); // Workout-ID

  // Methode, um Workout-ID zu setzen
  const setWorkoutId = (id: number | undefined) => {
    workoutId.value = id;
  };

  // useQuery-Logik
  const query = useQuery<WorkoutType>({
    queryKey: computed(() => ["workout", workoutId.value]),
    queryFn: () => {
      if (!workoutId.value) throw new Error("Workout ID is undefined");
      return fetchWorkout(workoutId.value);
    },
    enabled: computed(() => workoutId.value !== undefined),
  });

  // Zugriff auf die Daten
  const workout = computed(() => query.data.value);

  return {
    workoutId,
    workout,
    setWorkoutId,
    query, // Falls du Zugriff auf den Query-Status möchtest
  };
});
