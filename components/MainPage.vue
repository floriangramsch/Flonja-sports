<template>
  <Refresh v-if="isSuccess">
    <div class="flex h-dvh flex-col bg-sonja-bg">
      <Statusbar
        :users="users"
        :workouts="workouts"
        :workout="workout"
        :timer="timer"
        @stopTimer="stopTimer"
      />
      <Content
        v-if="users && workouts"
        :users="users"
        :workouts="workouts"
        v-model:workout="workout"
      />
      <Navbar />
    </div>
    <Loading v-if="!isSuccess" />
  </Refresh>
</template>

<script setup lang="ts">
const { isSuccess } = usePreloadData();
const { data: users } = useUsers();
const { data: workouts } = useWorkouts();

const loggedStore = useLoggedStore();

const { data: workout } = useGetWorkout(
  computed(() => loggedStore.logged.loggedWorkoutId),
);

const timer = ref<boolean>(false);
const stopTimer = () => (timer.value = false);
const startTimer = () => (timer.value = true);

onMounted(() => {
  if (import.meta.client) {
    loggedStore.initializeLogged();
  }
});
</script>
