<template>
  <div v-if="isSuccess" class="flex flex-col h-screen">
    <Statusbar
      :users="users"
      :workouts="workouts"
      :workout-start="workout?.start"
      :workout="workout"
      v-model:logged="logged"
      v-model:show="show"
    />
    <Content
      v-if="users && workouts && logged && show"
      :users="users"
      :workouts="workouts"
      v-model:workout="workout"
      v-model:logged="logged"
      v-model:show="show"
    />
    <Navbar v-model="show" />
  </div>
  <!-- loading -->
  <div
    v-else
    class="flex justify-center items-center text-5xl bg-sonja-bg h-screen"
  >
    Loading...
  </div>
</template>

<script setup lang="ts">
import useWorkouts from "~/composables/useWorkouts";
import type { LoggedType, ShowType } from "~/utils/types";

const { isSuccess } = usePreloadData();

const { data: users } = useUsers();
const { data: workouts } = useWorkouts();

const show = ref<ShowType>({
  showNew: false, // show dropdown
  showDialogEquip: false, // show equip dialog
  showDialogMuskle: false, // show muscle dialog
  showLogin: false, // show login
  showRouter: "workoutdetail",
});

const logged = ref<LoggedType>({
  isLogged: false,
  user: {
    id: 1,
    name: "Florian",
  },
  loggedWorkoutId: undefined,
});

const { data: workout } = useGetWorkout(
  computed(() => logged.value.loggedWorkoutId)
);

// Funktion zum Speichern des Anmeldezustands im Local Storage
const saveLoggedState = () => {
  localStorage.setItem("logged", JSON.stringify(logged.value));
};

// Funktion zum Laden des Anmeldezustands aus dem Local Storage
const loadLoggedState = () => {
  const savedLogged = localStorage.getItem("logged");
  if (savedLogged) {
    logged.value = JSON.parse(savedLogged);
  } else {
    saveLoggedState();
  }
};

onMounted(() => {
  loadLoggedState();
});

// Beobachte Änderungen im Anmeldezustand und speichere diese
watch(logged, saveLoggedState, { deep: true });
</script>
