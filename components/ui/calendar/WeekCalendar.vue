<script setup lang="ts">
import Week from "./Week.vue";

const props = defineProps<{
  data: WorkoutType[];
}>();

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

watch(
  () => props.data,
  () => groupData(),
);

onMounted(() => groupData());
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-7">
      <div v-for="day in weekDays" class="flex justify-center">
        {{ day }}
      </div>
    </div>
    <div v-for="week in groupedData" class="grid grid-cols-7">
      <Week :week="week" />
    </div>
  </div>
</template>
