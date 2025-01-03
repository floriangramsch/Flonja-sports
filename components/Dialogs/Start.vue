<template>
  <button v-if="loggedStore.logged.isLogged" @click.prevent="logout">
    <i class="fa-solid fa-right-from-bracket" />
  </button>
  <button
    v-else
    @click="
      {
        isOpen = !isOpen;
      }
    "
  >
    <i class="fa-solid fa-dumbbell" />
  </button>
  <Transition name="slide-fade-dropdown">
    <div
      v-if="isOpen"
      class="absolute right-14 top-10 flex flex-col rounded-md border-2 border-sonja-akz bg-sonja-text text-xl text-sonja-akz2 shadow-lg"
    >
      <button class="px-4 py-2" @click.prevent="newWorkout">
        Neues Training
      </button>
      <button class="px-4 py-2" @click.prevent="resumeWorkout">
        Weiter trainieren
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  workouts: WorkoutType[] | undefined;
}>();

const loggedStore = useLoggedStore();

const isOpen = ref<boolean>(false);

const mutation = useAddWorkout();

const newWorkout = () => {
  if (!loggedStore.logged.user?.id) return;
  mutation.mutate(loggedStore.logged.user?.id, {
    onSuccess: (data: any) => {
      loggedStore.logged = {
        isLogged: true,
        user: loggedStore.logged?.user,
        loggedWorkoutId: data.workoutId,
      };
    },
  });
};

const routeStore = useRouterStore();
const resumeWorkout = () => {
  if (props.workouts) {
    const latestWorkout = props.workouts
      .filter((workout) => workout.user_id === loggedStore.logged.user?.id)
      .reduce((prev, curr) => {
        return new Date(prev.start) < new Date(curr.start) ? curr : prev;
      });
    loggedStore.logged = {
      isLogged: true,
      user: {
        id: latestWorkout.user_id,
        name: latestWorkout.name,
      },
      loggedWorkoutId: Number(latestWorkout.workout_id),
    };
    loggedStore.toStorage();
    isOpen.value = false;
    routeStore.setWorkoutRoute("workoutdetail");
  }
};

// Funktion zum Ausloggen
const logout = () => {
  loggedStore.logout();
  isOpen.value = false;
  routeStore.setWorkoutRoute("home");
};
</script>

<style scoped>
.slide-fade-dropdown-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-dropdown-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-dropdown-enter-from,
.slide-fade-dropdown-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
