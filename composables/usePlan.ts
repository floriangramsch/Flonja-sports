import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { PlanExercise } from "~/utils/types";

export function usePlan() {
  return useQuery<Plan[]>({
    queryKey: ["plan"],
    queryFn: async () => {
      const res = await fetch("api/plan");
      const data = await res.json();
      return data;
    },
  });
}
export function useGetPlan(workoutPlanId: Ref<number | undefined>) {
  return useQuery<PlanExercise[]>({
    queryKey: computed(() => ["plan", workoutPlanId.value]),
    queryFn: async () => {
      if (!workoutPlanId.value) throw new Error("Workout plan ID is undefined");
      const response = await fetch(
        "/api/plan" + "?workout_plan_id=" + workoutPlanId.value,
      );
      if (!response.ok)
        throw new Error("Fehler beim Abrufen des Workout Plans");
      return response.json();
    },
    enabled: computed(() => workoutPlanId.value !== undefined),
  });
}

export function useAddPlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (form: { name: string; day?: number }) => {
      const response = await fetch("/api/plan", {
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

export function useDeletePlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch("/api/plan", {
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
export function useAddPlanExercise() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (form: {
      plan_id: number;
      exercise_id: number;
      sets: number;
      reps: number;
    }) => {
      const response = await fetch("/api/plan_exercise", {
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


export function useDeletePlanExercise() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch("/api/plan_exercise", {
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