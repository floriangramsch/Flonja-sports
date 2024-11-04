<template>
  <div
    class="flex snap-x snap-mandatory overflow-x-auto no-scrollbar cursor-pointer"
  >
    <div
      @click="editWorkout(workout)"
      class="p-1 flex min-w-full snap-start justify-center bg-sonja-bg rounded"
      v-for="(workout, id) in workouts"
      :key="id"
    >
      {{ formatTime(workout.start) }}
      <br />
      von
      {{ workout.user.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  workouts: WorkoutType;
  users: UserType;
  close: Boolean;
}>();

const emit = defineEmits(["update:modelValue", "update:close"]);

const editWorkout = (workout: { start: Date; end: Date; user: LoggedUser }) => {
  emit("update:modelValue", {
    user: workout.user,
    isLogged: true,
    workout: workout,
  });
  emit("update:close", false);
};
</script>
