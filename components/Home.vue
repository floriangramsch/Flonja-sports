<template>
  <div class="bg-sonja-fg h-full flex justify-center items-center">
    <div class="flex flex-col items-center -translate-y-10">
      <button
        class="bg-sonja-akz text-white h-12 px-20 rounded-3xl shadow flex items-center justify-center"
        @click.prevent="addWorkout"
      >
        Start
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAddWorkoutMutation } from "~/composables/workoutMutations";

const logged = defineModel<LoggedType>();

const mutation = useAddWorkoutMutation();

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
