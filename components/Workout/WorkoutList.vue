<script setup lang="ts">
import useDeleteWorkout from "~/composables/Workouts/useDeleteWorkout";
import Confirm from "../Dialogs/Confirm.vue";
import Label from "../ui/label/Label.vue";
import { showTime } from "~/utils/helpers";
import Plan from "./Plan.vue";

defineProps<{
  workouts: WorkoutType[];
  workout: WorkoutType | undefined;
  users: UserType[];
}>();

const loggedStore = useLoggedStore();
const routerStore = useRouterStore();
const wexToShow = useExToShowStore();

const editWorkout = (workout: WorkoutType) => {
  loggedStore.logged = {
    user: {
      id: workout.user_id,
      name: workout.name,
    },
    isLogged: true,
    loggedWorkoutId: workout.workout_id,
  };
  wexToShow.reset()
  loggedStore.toStorage();
  routerStore.setRoute('workoutpage')
};

const mutation = useDeleteWorkout();
const workoutToDelete = ref<number>();
const showConfirmDeleteWorkout = ref<boolean>(false);
const deleteWorkout = () => {
  if (workoutToDelete.value) {
    mutation.mutate(workoutToDelete.value, {
      onSuccess: () => {
        if (loggedStore.logged) {
          loggedStore.logged.isLogged = false;
          loggedStore.logged.loggedWorkoutId = undefined;
          showConfirmDeleteWorkout.value = false;
          loggedStore.toStorage();
        }
      },
    });
  }
};
</script>

<template>
  <div class="no-scrollbar flex snap-y snap-mandatory flex-col overflow-y-auto">
    <Header @right="routerStore.setRoute('stats')" rightIcon="fa-solid fa-list">
      Workout List
    </Header>
    <!-- workout list -->
    <div
      v-for="workout in workouts"
      @click="editWorkout(workout)"
      class="flex min-w-full cursor-pointer snap-start flex-col p-2"
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
          :selected="workout.workout_id === loggedStore.logged.loggedWorkoutId"
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
</template>
