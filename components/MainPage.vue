<template>
  <div
    v-if="
      isUsersSuccess && isEquipsSuccess && isMusclesSuccess && isWorkoutsSuccess
    "
  >
    <Statusbar
      v-model:equips="equips"
      v-model:logged="logged"
      v-model:muscles="muscles"
      v-model:show="show"
      v-model:users="users"
      v-model:workouts="workouts"
    />
    <div class="flex flex-col bg-sonja-bg text-sonja-text h-screen text-2xl">
      <div v-if="logged.user" class="mb-20">
        <h1
          class="absolute left-[18%] justify-center text-sonja-text text-1xl rounded bg-sonja-fg bg-opacity-25 backdrop-blur-md p-1"
        >
          Hallo Se Bebi {{ logged.user?.name }}
          <br />
          {{ formatTime(loggedWorkout?.start) }}
        </h1>
      </div>
      <ExerciseOverview
        v-if="show.showRouter === 'exercises' && users"
        :users="users"
        v-model="equips"
        v-model:filter="exerciseFilter"
      />
      <WorkoutOverview
        v-if="show.showRouter === 'workouts' && users && workouts"
        :workouts="workouts"
        :users="users"
        v-model="logged"
        v-model:showRouter="show.showRouter"
      />
      <EquipList
        v-if="show.showRouter === 'equiplist' && equips && muscles && users"
        :equips="equips"
        :muscles="muscles"
        :users="users"
        :workout="loggedWorkout"
        v-model:filter="exerciseFilter"
        v-model:showRouter="show.showRouter"
      />
      <Home v-if="show.showRouter === 'home'" v-model="logged" />
    </div>
    <Navbar v-model="show" />
  </div>
  <!-- loading -->
  <div
    v-else
    class="flex justify-center items-center text-5xl -mt-10 bg-sonja-fg h-screen"
  >
    Loading...
  </div>
</template>

<script setup lang="ts">
import EquipList from "@/components/Equip/EquipList.vue";
import ExerciseOverview from "@/components/Exercises/ExerciseOverview.vue";
import WorkoutOverview from "@/components/Workout/WorkoutOverview.vue";
import { useQuery } from "@tanstack/vue-query";

const { data: users, isSuccess: isUsersSuccess } = useQuery<UserType>({
  queryKey: ["users"],
  queryFn: fetchUsers,
});
const { data: equips, isSuccess: isEquipsSuccess } = useQuery<EquipType>({
  queryKey: ["equips"],
  queryFn: fetchEquipment,
});
const { data: muscles, isSuccess: isMusclesSuccess } = useQuery<MuscleType>({
  queryKey: ["muscles"],
  queryFn: fetchMuscles,
});
const { data: workouts, isSuccess: isWorkoutsSuccess } = useQuery<WorkoutType>({
  queryKey: ["workouts"],
  queryFn: fetchWorkouts,
});

const show = ref({
  showNew: false, // show dropdown
  showDialogEquip: false, // show equip dialog
  showDialogMuskle: false, // show muscle dialog
  showLogin: false, // show login
  showRouter: "home",
});

const exerciseFilter = ref<number[]>([]);

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
    const lWorkout = logged.value.loggedWorkout
      ? workouts.value[logged.value.loggedWorkout]
      : undefined;
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
</script>
