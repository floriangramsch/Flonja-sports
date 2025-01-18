<script setup lang="ts">
const props = defineProps<{
  week: WorkoutType[];
  selectedWorkout?: WorkoutType;
}>();

const emit = defineEmits<{
  (e: "showWorkout", workout: WorkoutType): void;
}>();

const loggedStore = useLoggedStore();


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
      @click="emit('showWorkout', workout)"
      class="relative flex flex-col items-center justify-center pt-4"
      :class="{
        'cursor-pointer': loggedStore.logged.user.id === workout.user_id,
        'text-sonja-akz':
          workout.workout_id === loggedStore.logged.loggedWorkoutId,
      }"
    >
      <div
        class="flex translate-y-[2px] items-center justify-center text-lg"
        :class="{
          'bg-sonja-akz rounded-full px-1': selectedWorkout?.workout_id === workout.workout_id,
        }"
      >
      <!-- 'border-l-2 border-sonja-akz pl-1': selectedWorkout?.workout_id === workout.workout_id, -->
        {{ new Date(workout.start).getDate() }}
      </div>
      <span
        class="noscrollbar absolute bottom-6 max-w-14 overflow-x-scroll text-nowrap text-start text-xs"
      >
        {{ workout.main_category }}
      </span>
    </div>
    <div v-else class="flex items-center justify-center pt-4">
      <i class="fa-solid fa-square" />
    </div>
    <!-- :class="`col-start-${getWeekdayPosition(new Date(day.start))}`" -->
  </div>
</template>
