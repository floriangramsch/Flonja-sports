import { useQuery } from "@tanstack/vue-query";

export default function useWorkouts() {
  return useQuery<WorkoutType>({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });
}
