import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

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
    isSuccess: isMusclesSuccess,
    isError: isMusclesError,
    isLoading: isMusclesLoading,
  } = useQuery<MuscleType>({
    queryKey: ["muscles"],
    queryFn: fetchMuscles,
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
      isMusclesSuccess.value &&
      isWorkoutsSuccess.value
    );
  });

  const isError = computed(() => {
    return (
      isUsersError.value ||
      isEquipsError.value ||
      isMusclesError.value ||
      isWorkoutsError.value
    );
  });

  const isLoading = computed(() => {
    return (
      isUsersLoading.value &&
      isEquipsLoading.value &&
      isMusclesLoading.value &&
      isWorkoutsLoading.value
    );
  });

  return {
    isSuccess,
    isError,
    isLoading,
  };
}
