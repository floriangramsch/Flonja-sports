import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export default function useMuscles() {
  return useQuery<MuscleType>({
    queryKey: ["muscles"],
    queryFn: fetchMuscles,
  });
}

export function useAddMuscle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMuscleName: string) => {
      const response = await fetch("/api/muscle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newMuscle: newMuscleName,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["muscles"] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });
}
