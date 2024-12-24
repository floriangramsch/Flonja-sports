<script setup lang="ts">
import useDeleteWorkout from "~/composables/Workouts/useDeleteWorkout";
import Confirm from "../Dialogs/Confirm.vue";
import Label from "../ui/label/Label.vue";
import { showTime } from "~/utils/helpers";
import Plan from "./Plan.vue";

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

const toggled = ref<boolean>(false);
</script>

<template>
  <div
    class="no-scrollbar flex snap-y snap-mandatory flex-col overflow-y-auto"
  >
    <!-- Header -->
    <div class="flex w-full justify-evenly px-2 py-4">
      <div class="text-center text-4xl font-bold">Workout List</div>
      <button
        class="absolute right-6 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="toggled = !toggled"
      >
        <i class="fa-solid fa-list" />
      </button>
    </div>
    <!-- workout list -->
    <div v-if="toggled">
      <div
        v-for="workout in workouts"
        @click="editWorkout(workout)"
        class="flex min-w-full snap-start flex-col p-2"
        :key="workout.workout_id"
      >
        <div class="flex">
          <Label
            :value="
              showTime(workout?.start) +
              '-' +
              (showTime(workout?.end)?.slice(-5) ?? '?')
            "
            :label="workout.name"
            :selected="workout.workout_id === logged?.loggedWorkoutId"
          />
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
      </div>
      <Confirm
        v-model:is-open="showConfirmDeleteWorkout"
        class="ml-5"
        @yes="deleteWorkout()"
      />
    </div>
    <Plan v-else />
  </div>
</template>
