<script setup lang="ts">
import Start from "./Dialogs/Start.vue";

const logged = defineModel<LoggedType>();
const workouts = defineModel<WorkoutType>("workouts");
const show = defineModel<any>("show");

// Funktion zum Ausloggen
const logout = () => {
  logged.value = {
    isLogged: false,
    user: logged.value?.user,
    loggedWorkout: undefined,
  };
  show.value.showLogin = false;
  localStorage.removeItem("logged");
};
</script>

<template>
  <nav class="fixed bottom-0 w-full">
    <div
      class="flex justify-evenly bg-sonja-fg border-t-2 border-sonja-fg-darker text-sonja-text"
    >
      <div class="flex-grow">
        <button
          @click="
            show.showRouter !== 'exercises'
              ? (show.showRouter = 'exercises')
              : (show.showRouter = 'equiplist')
          "
          class="text-lg border-sonja-fg pt-2 pb-10 w-full"
        >
          <i class="fa-solid fa-chart-line text-4xl" />
        </button>
      </div>

      <div v-if="logged?.isLogged" class="flex-grow">
        <button
          @click.prevent="logout"
          class="text-lg border-sonja-fg pt-2 pb-10 w-full"
        >
          <i class="fa-solid fa-cat text-4xl"></i>
        </button>
      </div>
      <div v-else class="flex-grow">
        <button
          @click="
            {
              show.showLogin = !show.showLogin;
              show.showNew = false;
            }
          "
          class="text-lg border-sonja-fg pt-2 pb-10 w-full"
        >
          <i class="fa-solid fa-dumbbell text-4xl"></i>
        </button>
        <Start
          v-if="show.showLogin"
          v-outside
          v-model="logged"
          v-model:workouts="workouts"
        />
      </div>
      <div class="flex-grow">
        <button
          @click="
            show.showRouter !== 'workouts'
              ? (show.showRouter = 'workouts')
              : (show.showRouter = 'equiplist')
          "
          class="text-lg border-sonja-fg pt-2 pb-10 w-full"
        >
          <i class="fa-solid fa-calendar text-4xl"></i>
        </button>
      </div>
    </div>
  </nav>
</template>
