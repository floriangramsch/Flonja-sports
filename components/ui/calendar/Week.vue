<script setup lang="ts">
const props = defineProps<{
  week: WorkoutType[];
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

function getWeekdayPosition(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

const weekDays = ref();

const arrangeDays = () => {
  weekDays.value = Array.from({ length: 7 }, (_, i) => {
    const day = i + 1; // Montag = 1, ..., Sonntag = 7
    const workout = props.week.find(
      (d) => getWeekdayPosition(new Date(d.start)) === day,
    );
    return workout || null;
  });
};

watch(
  () => props.week,
  () => arrangeDays(),
);

onMounted(() => arrangeDays());
</script>

<template>
  <div v-for="workout in weekDays" class="flex min-w-10 justify-center">
    <div
      v-if="workout"
      @click="editWorkout(workout)"
      class="flex flex-col justify-center items-center"
      :class="{
        'cursor-pointer': loggedStore.logged.user.id === workout.user_id,
        'text-sonja-akz':
          workout.workout_id === loggedStore.logged.loggedWorkoutId,
      }"
    >
      {{ new Date(workout.start).getDate() }}
      <span class="text-xs">
        {{ workout.main_category }}
      </span>
    </div>
    <div v-else class="flex justify-center items-center">
      <i class="fa-solid fa-square" />
    </div>
    <!-- :class="`col-start-${getWeekdayPosition(new Date(day.start))}`" -->
  </div>
</template>
