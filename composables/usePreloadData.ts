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
    isSuccess: isEquipsSuccess,
    isError: isEquipsError,
    isLoading: isEquipsLoading,
  } = useQuery<EquipType>({
    queryKey: ["equips"],
    queryFn: fetchEquipment,
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
      isEquipsSuccess.value &&
      isCategorySuccess.value &&
      isWorkoutsSuccess.value
    );
  });

  const isError = computed(() => {
    return (
      isUsersError.value ||
      isEquipsError.value ||
      isCategoryError.value ||
      isWorkoutsError.value
    );
  });

  const isLoading = computed(() => {
    return (
      isUsersLoading.value &&
      isEquipsLoading.value &&
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
