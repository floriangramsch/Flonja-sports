import { useQuery } from "@tanstack/vue-query";

export default function useExercisesByWorkout(workoutId?: number) {
  return useQuery({
    queryKey: ["exercises", workoutId],
    queryFn: async () =>
      await fetch("/api/getExercisesByWorkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workoutId }),
      }).then((res) => res.json()),
    enabled: !!workoutId,
  });
}
