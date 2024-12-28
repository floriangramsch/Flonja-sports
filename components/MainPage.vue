<template>
  <div
    v-if="isSuccess"
    class="flex h-dvh flex-col"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      v-if="isPulling"
      class="fixed left-0 right-0 top-0 flex h-20 items-center justify-center bg-sonja-text text-3xl"
    >
      <span v-if="loading">Loading</span>
      <span v-else-if="isPulling">Pulling</span>
    </div>
    <Statusbar
      :users="users"
      :workouts="workouts"
      :workout-start="workout?.start"
      :workout="workout"
      :timer="timer"
      @stopTimer="stopTimer"
    />
    <Content
      v-if="users && workouts && loggedStore"
      :users="users"
      :workouts="workouts"
      v-model:workout="workout"
      @startTimer="startTimer"
    />
    <Navbar />
  </div>
  <!-- loading -->
  <div
    v-else
    class="flex h-dvh items-center justify-center gap-4 bg-sonja-bg text-5xl"
  >
    <i class="fa-solid fa-dumbbell fa-spin" />
    Loading...
  </div>
</template>

<script setup lang="ts">
import useWorkouts from "~/composables/useWorkouts";
import Navbar from "./Navbar.vue";

const { isSuccess } = usePreloadData();

const { data: users } = useUsers();
const { data: workouts } = useWorkouts();

const timer = ref<boolean>(false);
const stopTimer = () => (timer.value = false);
const startTimer = () => (timer.value = true);

const loggedStore = useLoggedStore();

const { data: workout } = useGetWorkout(
  computed(() => loggedStore.logged.loggedWorkoutId),
);

// Pull to Refresh
const startY = ref(0); // Startpunkt des Touches
const currentY = ref(0); // Aktuelle Position während des Moves
const isPulling = ref(false); // Status des Pulls
const loading = ref(false);

const onTouchStart = (e: TouchEvent) => {
  if (window.scrollY === 0) {
    startY.value = e.touches[0].clientY;
    isPulling.value = true;
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (isPulling.value) {
    currentY.value = e.touches[0].clientY;

    const pullDistance = currentY.value - startY.value;
    loading.value = false;
    if (pullDistance > 600) {
      loading.value = true;
    }
  }
};

const handleRefresh = async () => {
  await refresh();
};

const refresh = useRefresh();

const onTouchEnd = () => {
  if (isPulling.value) {
    const pullDistance = currentY.value - startY.value;
    if (pullDistance > 600) {
      handleRefresh();
    }
    isPulling.value = false;
    loading.value = false;
    startY.value = 0;
    currentY.value = 0;
  }
};

onMounted(() => {
  if (import.meta.client) {
    loggedStore.initializeLogged();
  }
});
</script>
