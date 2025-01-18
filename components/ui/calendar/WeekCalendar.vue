<script setup lang="ts">
import Button from "../buttons/Button.vue";
import Week from "./Week.vue";

const props = defineProps<{
  data: WorkoutType[];
}>();

const loggedStore = useLoggedStore();
const routerStore = useRouterStore();
const wexToShow = useExToShowStore();

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

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

function getStartOfWeek(date: Date): Date {
  const day = date.getDay() || 7; // getDay() gibt 0 für Sonntag zurück, also wird das auf 7 gesetzt
  date.setDate(date.getDate() - day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

const groupedData = ref();

const groupData = () => {
  groupedData.value = props.data.reduce(
    (acc: { [key: string]: WorkoutType[] }, workout) => {
      const date = new Date(workout.start);
      const weekStart = getStartOfWeek(new Date(date));

      const weekKey = weekStart.toISOString();
      if (!acc[weekKey]) {
        acc[weekKey] = [];
      }
      acc[weekKey].push(workout);

      return acc;
    },
    {},
  );
};

const workoutToShow = ref<WorkoutType>();
const isShowWorkout = ref(false);
const showWorkout = (workout: WorkoutType) => {
  workoutToShow.value = workout;
  isShowWorkout.value = true;
};

watch(
  () => props.data,
  () => {
    groupData();
    workoutToShow.value = undefined;
    isShowWorkout.value = false;
  },
);

onMounted(() => groupData());
</script>

<template>
  <div class="">
    <div class="grid grid-cols-7 border-b-2 border-sonja-akz text-sm">
      <div v-for="day in weekDays" class="flex justify-center">
        {{ day }}
      </div>
    </div>
    <div class="max-h-72 w-full overflow-scroll">
      <div v-for="week in groupedData" class="grid grid-cols-7">
        <Week
          :week="week"
          :selectedWorkout="workoutToShow"
          @showWorkout="showWorkout"
        />
      </div>
    </div>
    <div
      v-if="isShowWorkout"
      class="absolute bottom-1 flex w-full flex-col border-t border-sonja-akz"
    >
      <div>
        {{
          showTime(workoutToShow?.start) +
          "-" +
          showTime(workoutToShow?.end).slice(-5)
        }}
      </div>
      <div>
        {{
          workoutToShow?.main_category
            ? "Main category: " + workoutToShow?.main_category
            : "No Exercise yet"
        }}
      </div>
      <Button @action="() => editWorkout(workoutToShow!)">
        Edit workout
      </Button>
    </div>
    <div
      v-else
      class="absolute bottom-1 flex h-[7.25rem] w-full flex-col items-center justify-center border-t border-sonja-akz"
    >
      No Workout selected
    </div>
  </div>
</template>
