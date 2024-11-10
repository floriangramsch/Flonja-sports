import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export function useGetSets(exercise_id: number) {
  return useQuery({
    queryKey: ["sets", exercise_id],
    queryFn: async () =>
      await fetch(`/api/set?exercise_id=${exercise_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.log(error)),
  });
}

export const useAddSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exercise_id,
      weight,
      reps,
    }: {
      exercise_id: number;
      weight: number;
      reps: number;
    }) => {
      const response = await fetch("/api/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exercise_id,
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
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
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
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["equips"] });
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["sets"] });
    },
  });
}

export function useGetLastSets({
  equip_id,
  user_id,
  start,
}: {
  equip_id: number;
  user_id: number;
  start: Date;
}) {
  return useQuery({
    queryKey: ["sets", equip_id, user_id, start],
    queryFn: async () =>
      await fetch(`/api/lastSets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ equip_id: equip_id, user_id, start }),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error)),
  });
}
