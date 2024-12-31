import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export function useGetSets() {
  return useQuery<SetHelperType[]>({
    queryKey: ["sets"],
    queryFn: async () =>
      await fetch("/api/set", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.log(error)),
  });
}

export function useGetSetsByExerciseId(workout_exercise_id: Ref<number>) {
  return useQuery({
    queryKey: computed(() => ["sets", workout_exercise_id.value]),
    // queryKey: ["sets", workout_exercise_id],
    queryFn: async () =>
      await fetch(`/api/set?workout_exercise_id=${workout_exercise_id.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.log(error)),
    // enabled: workout_exercise_id.value !== 0,
  });
}

export const useAddSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workout_exercise_id,
      weight,
      reps,
    }: {
      workout_exercise_id: number;
      weight: number;
      reps: number;
    }) => {
      const response = await fetch("/api/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workout_exercise_id,
          weight,
          reps,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add set");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sets"] });
    },
  });
};

export const useUpdateSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      set_id,
      weight,
      reps,
    }: {
      set_id: number;
      weight: number;
      reps: number;
    }) => {
      const response = await fetch("/api/set", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          set_id,
          weight,
          reps,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update set");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sets"] });
    },
  });
};

export function useDeleteSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (set_id: number) => {
      const response = await fetch("/api/set", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ set_id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sets"] });
    },
  });
}

export function useGetLastSets(
  lastSet: Ref<{
    exercise_id: number;
    user_id: number;
    start: Date;
  }>,
) {
  return useQuery({
    queryKey: computed(() => [
      "sets",
      lastSet.value.exercise_id,
      lastSet.value.user_id,
      lastSet.value.start,
    ]),
    queryFn: async () =>
      await fetch(`/api/lastSets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exercise_id: lastSet.value.exercise_id,
          user_id: lastSet.value.user_id,
          start: lastSet.value.start,
        }),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error)),
  });
}
