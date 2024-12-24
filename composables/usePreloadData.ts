import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";

export function useRefresh() {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.invalidateQueries();
  };
}

export default function usePreloadData() {
  const {
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    isLoading: isUsersLoading,
  } = useQuery<UserType>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const {
    isSuccess: isExercisesSuccess,
    isError: isExercisesError,
    isLoading: isExercisesLoading,
  } = useQuery<ExerciseType>({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });
  const {
    isSuccess: isCategorySuccess,
    isError: isCategoryError,
    isLoading: isCategoryLoading,
  } = useQuery<CategoryType>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const {
    isSuccess: isWorkoutsSuccess,
    isError: isWorkoutsError,
    isLoading: isWorkoutsLoading,
  } = useQuery<WorkoutType>({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  const isSuccess = computed(() => {
    return (
      isUsersSuccess.value &&
      isExercisesSuccess.value &&
      isCategorySuccess.value &&
      isWorkoutsSuccess.value
    );
  });

  const isError = computed(() => {
    return (
      isUsersError.value ||
      isExercisesError.value ||
      isCategoryError.value ||
      isWorkoutsError.value
    );
  });

  const isLoading = computed(() => {
    return (
      isUsersLoading.value &&
      isExercisesLoading.value &&
      isCategoryLoading.value &&
      isWorkoutsLoading.value
    );
  });

  return {
    isSuccess,
    isError,
    isLoading,
  };
}
