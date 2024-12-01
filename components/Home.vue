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

<template>
  <div class="flex h-full items-center justify-center bg-sonja-bg">
    <button
      class="flex h-12 items-center rounded-3xl bg-sonja-text px-20 text-sonja-akz3 shadow"
      @click.prevent="addWorkout"
    >
      Start
    </button>
  </div>
</template>
