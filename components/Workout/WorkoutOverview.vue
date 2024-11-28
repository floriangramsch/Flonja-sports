<script setup lang="ts">
import useDeleteWorkout from "~/composables/Workouts/useDeleteWorkout";
import Confirm from "../Dialogs/Confirm.vue";

defineProps<{
  workouts: WorkoutType[];
  users: UserType;
}>();

const logged = defineModel<LoggedType>();
const show = defineModel<ShowType>("show");

const editWorkout = (workout: WorkoutType) => {
  logged.value = {
    user: {
      id: workout.user_id,
      name: workout.name,
    },
    isLogged: true,
    loggedWorkoutId: workout.workout_id,
  };
  if (show.value) show.value.showRouter = "workoutdetail";
};

const mutation = useDeleteWorkout();
const workoutToDelete = ref<number>();
const showConfirmDeleteWorkout = ref<boolean>(false);
const deleteWorkout = () => {
  if (workoutToDelete.value) {
    mutation.mutate(workoutToDelete.value, {
      onSuccess: () => {
        if (logged.value) {
          logged.value.isLogged = false;
          logged.value.loggedWorkoutId = undefined;
          showConfirmDeleteWorkout.value = false;
        }
      },
    });
  }
};
</script>

<template>
  <div
    class="flex flex-col snap-y snap-mandatory overflow-y-auto no-scrollbar cursor-pointer"
  >
    <!-- Header -->
    <div class="w-full flex justify-evenly py-4 px-2">
      <div class="text-4xl font-bold text-center">Workout List</div>
    </div>
    <!-- workout list -->
    <div
      v-for="workout in workouts"
      @click="editWorkout(workout)"
      class="p-1 flex flex-col min-w-full snap-start border-b border-sonja-akz"
      :class="
        workout.workout_id === logged?.loggedWorkoutId
          ? 'bg-sonja-bg-darker'
          : 'bg-sonja-bg'
      "
      :key="workout.workout_id"
    >
      <div class="flex">
        {{ formatTime(workout.start) }}
        <button
          class="ml-2"
          @click.stop="
            workoutToDelete = Number(workout.workout_id);
            showConfirmDeleteWorkout = true;
          "
        >
          <i class="fa-solid fa-close text-red-800" />
        </button>
      </div>
      <div class="pl-3">
        von
        {{ workout.name }}
      </div>
    </div>
    <Confirm
      v-model:is-open="showConfirmDeleteWorkout"
      class="ml-5"
      @yes="deleteWorkout()"
    />
  </div>
</template>
