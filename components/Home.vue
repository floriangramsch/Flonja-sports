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

const emit = defineEmits<{
  (e: "switch"): void;
}>();

const mutation = useAddWorkout();

const addWorkout = () => {
  if (logged.value?.user?.id) {
    mutation.mutate(logged.value?.user?.id, {
      onSuccess: ({ workoutId }) => {
        if (logged.value) {
          logged.value.isLogged = true;
          logged.value.loggedWorkoutId = workoutId;
          emit("switch");
        }
      },
    });
  }
};
</script>
