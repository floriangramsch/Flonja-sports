<template>
  <div class="bg-sonja-bg flex justify-center items-center h-full">
    <div class="flex flex-col items-center">
      <button
        class="bg-sonja-akz text-sonja-akz2 h-12 px-20 rounded-3xl shadow flex items-center justify-center"
        @click.prevent="addWorkout"
      >
        Start
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const logged = defineModel<LoggedType>();

const mutation = useAddWorkout();

const addWorkout = () => {
  mutation.mutate(1, {
    onSuccess: ({ workoutId }) => {
      if (logged.value) {
        logged.value.loggedWorkout = workoutId;
      }
    },
  });
};
</script>
