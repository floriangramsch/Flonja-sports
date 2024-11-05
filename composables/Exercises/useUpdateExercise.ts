import { useMutation } from "@tanstack/vue-query";

export default function useUpdateExercise() {
  return useMutation({
    mutationFn: async (newEx) => {
      const response = await fetch("/api/updateExercise", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEx),
      });
      return response.json();
    },
  });
}
