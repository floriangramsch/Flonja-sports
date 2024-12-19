import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export function useWorkoutPlan() {
  return useQuery<WorkoutPlan[]>({
    queryKey: ["plan"],
    queryFn: async () => {
      const res = await fetch("api/workoutplan");
      const data = await res.json();
      return data;
    },
  });
}
export function useGetWorkoutPlan(workoutPlanId: Ref<number | undefined>) {
  return useQuery<WorkoutPlanEquip[]>({
    queryKey: computed(() => ["plan", workoutPlanId.value]),
    queryFn: async () => {
      if (!workoutPlanId.value) throw new Error("Workout plan ID is undefined");
      const response = await fetch(
        "/api/workoutplan" + "?workout_plan_id=" + workoutPlanId.value,
      );
      if (!response.ok)
        throw new Error("Fehler beim Abrufen des Workout Plans");
      return response.json();
    },
    enabled: computed(() => workoutPlanId.value !== undefined),
  });
}

export function useAddWorkoutPlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (form: { name: string; day?: number }) => {
      const response = await fetch("/api/workoutplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok)
        throw new Error("Fehler beim Erstellen des Workout Plans");
      return response.json();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["plan"] }),
  });
}

export function useDeleteWorkoutPlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch("/api/workoutplan", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (!response.ok)
        throw new Error("Fehler beim Löschen des Workout Plans");
      return response.json();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["plan"] }),
  });
}

// Plan Ex
export function useAddWorkoutPlanExercise() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (form: {
      plan_id: number;
      exercise_id: number;
      sets: number;
      reps: number;
    }) => {
      const response = await fetch("/api/workoutplanequip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok)
        throw new Error("Fehler beim Hinzufügen der Exercise des Workout Plans");
      return response.json();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["plan"] }),
  });
}


export function useDeleteWorkoutPlanExercise() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch("/api/workoutplanequip", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (!response.ok)
        throw new Error("Fehler beim Löschen des Workout Plans Exercises");
      return response.json();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["plan"] }),
  });
}