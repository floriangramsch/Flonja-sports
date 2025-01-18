<script setup lang="ts">
import useDeleteWorkout from "~/composables/Workouts/useDeleteWorkout";
import Confirm from "../Dialogs/Confirm.vue";
import Label from "../ui/label/Label.vue";
import { showTime } from "~/utils/helpers";
import UserSelectionHeader from "../Header/UserSelectionHeader.vue";
import WeekCalendar from "../ui/calendar/WeekCalendar.vue";

defineProps<{
  workouts: WorkoutType[];
  users: UserType[];
}>();

const loggedStore = useLoggedStore();
const routerStore = useRouterStore();
const wexToShow = useExToShowStore();

const showList = ref<boolean>(false);

const editWorkout = (w: WorkoutType) => {
  if (
    loggedStore.logged.user.id === w.user_id ||
    loggedStore.logged.user.name === "Florian"
  ) {
    loggedStore.logged = {
      user: {
        id: w.user_id,
        name: w.name,
      },
      isLogged: true,
      loggedWorkoutId: w.workout_id,
    };
    wexToShow.reset();
    loggedStore.toStorage();
    routerStore.setRoute("workoutpage");
  }
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

const userSelectionRef = ref<InstanceType<typeof UserSelectionHeader>>();

onMounted(() => {
  if (userSelectionRef.value) {
    userSelectionRef.value.selected = loggedStore.logged.user.id ?? 0;
  }
});
</script>

<template>
  <div class="no-scrollbar flex snap-y snap-mandatory flex-col overflow-y-auto">
    <Header
      @left="showList = !showList"
      @right="routerStore.setRoute('stats')"
      rightIcon="fa-solid fa-list"
      leftIcon="fa-solid fa-barcode"
    >
      Workout List
    </Header>
    <UserSelectionHeader ref="userSelectionRef" class="mb-3" />
    <!-- workout list -->
    <WeekCalendar
      :data="
        workouts.filter((workout) => {
          if (userSelectionRef?.selected === 0) return true;
          else return userSelectionRef?.selected === workout.user_id;
        })
      "
    />
    <div
      v-if="showList"
      v-for="w in workouts.filter((wor) => {
        if (userSelectionRef?.selected === 0) return true;
        else return userSelectionRef?.selected === wor.user_id;
      })"
      @click="editWorkout(w)"
      class="flex min-w-full snap-start flex-col p-2"
      :class="{
        'cursor-pointer': loggedStore.logged.user.id === w.user_id,
      }"
      :key="w.workout_id"
    >
      <div class="flex">
        <Label
          :value="
            showTime(w?.start) + '-' + (showTime(w?.end)?.slice(-5) ?? '?')
          "
          :label="w.name"
          :selected="w.workout_id === loggedStore.logged.loggedWorkoutId"
        />
        <button
          class="ml-2"
          @click.stop="
            workoutToDelete = Number(w.workout_id);
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
