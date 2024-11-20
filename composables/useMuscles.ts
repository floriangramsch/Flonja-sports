import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

export default function useMuscles() {
  return useQuery<MuscleType[]>({
    queryKey: ["muscles"],
    queryFn: fetchMuscles,
  });
}

export const useUpdateMuscle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      muscle_id,
    }: {
      name: string;
      muscle_id: number;
    }) => {
      if (muscle_id) {
        const response = await fetch("/api/muscle", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            muscle_id,
            name,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update muscle");
        }
      } else {
        throw new Error("Failed to update muscle");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["muscles"] });
    },
  });
};

export const useDeleteMuscle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (muscle_id: number) => {
      if (muscle_id) {
        const response = await fetch("/api/muscle", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            muscle_id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete muscle");
        }
      } else {
        throw new Error("Failed to delete muscle");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["muscles"] });
    },
  });
};

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
