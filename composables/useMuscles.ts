import { useQuery } from "@tanstack/vue-query";

export default function useMuscles() {
  return useQuery<MuscleType>({
    queryKey: ["muscles"],
    queryFn: fetchMuscles,
  });
}
