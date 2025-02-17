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

const { data: workoutExercises } = useWorkoutExercisesByWorkout(
  computed(() => workoutToShow.value?.workout_id),
);

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
    <!-- calendar -->
    <div class="grid grid-cols-7 border-b-2 border-sonja-akz text-sm">
      <div v-for="day in weekDays" class="flex justify-center">
        {{ day }}
      </div>
    </div>
    <div class="h-72 w-full overflow-scroll">
      <div v-for="week in groupedData" class="grid grid-cols-7">
        <Week
          :week="week"
          :selectedWorkout="workoutToShow"
          @showWorkout="showWorkout"
        />
      </div>
    </div>
    <!-- detail -->
    <div
      v-if="isShowWorkout"
      class="flex w-full flex-col overflow-y-scroll border-t border-sonja-akz pt-1 text-base"
    >
      <div class="flex w-full items-center justify-center gap-2 font-bold">
        {{
          showTime(workoutToShow?.start) +
          "-" +
          showTime(workoutToShow?.end).slice(-5)
        }}
        <Button
          class="py-1 font-normal"
          @action="() => editWorkout(workoutToShow!)"
        >
          Edit workout
        </Button>
      </div>
      <div class="flex w-full justify-center font-bold">
        {{
          workoutToShow?.main_category
            ? "Main category: " + workoutToShow?.main_category
            : "No Exercise yet"
        }}
      </div>
      <div
        v-for="wex in workoutExercises"
        class="relative flex items-center gap-1 pb-1"
      >
        <div class="noscrollbar mr-auto overflow-scroll text-nowrap px-1">
          {{ wex.exercise_name }}
        </div>
        <div
          class="flex items-center justify-start gap-1 overflow-scroll text-nowrap"
        >
          <UiChip
            v-for="category in wex.categories"
            :content="category.name"
            :type="category.type"
            animated
          />
          <UiChip :content="wex.metric" type="metric" animated />
          <UiChip :content="wex.type" type="exerciseType" animated />
        </div>
      </div>
    </div>
    <!-- else -->
    <div
      v-else
      class="bottom-1 flex h-20 w-full flex-col items-center justify-center border-t border-sonja-akz"
    >
      No Workout selected
    </div>
  </div>
</template>
