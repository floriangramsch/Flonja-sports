<template>
  <div v-if="isSuccess" class="flex flex-col h-screen">
    <Statusbar
      :users="users"
      :workouts="workouts"
      :workout-start="loggedWorkout?.start"
      v-model:logged="logged"
      v-model:show="show"
    />
    <Content
      v-if="users && workouts && logged && show"
      :users="users"
      :workouts="workouts"
      v-model:logged-workout="loggedWorkout"
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

const { isSuccess } = usePreloadData();

const { data: users } = useUsers();
const { data: workouts } = useWorkouts();

const show = ref({
  showNew: false, // show dropdown
  showDialogEquip: false, // show equip dialog
  showDialogMuskle: false, // show muscle dialog
  showLogin: false, // show login
  showRouter: "home",
});

const logged: Ref<LoggedType> = ref({
  isLogged: false,
  user: {
    id: 1,
    name: "Florian",
  },
  loggedWorkout: undefined,
});

const loggedWorkout = computed(() => {
  if (workouts.value) {
    console.log("yay");
    const lWorkout = logged.value.loggedWorkout
      ? workouts.value[logged.value.loggedWorkout]
      : undefined;
    console.log(logged.value.loggedWorkout);
    console.log(lWorkout);
    if (lWorkout) {
      return { id: logged.value.loggedWorkout, ...lWorkout };
    }
  }
});

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

watch(loggedWorkout, (newData) => {
  if (newData?.id) {
    show.value.showRouter = "workoutdetail";
  }
});
</script>
