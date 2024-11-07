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
    }: {
      exercise_id: number;
      weight: number;
    }) => {
      const response = await fetch("/api/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exercise_id,
          weight,
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
