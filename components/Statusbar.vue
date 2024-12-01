<script setup lang="ts">
import Start from "./Dialogs/Start.vue";
import Timer from "./Timer/Timer.vue";

const props = defineProps<{
  users: UserType | undefined;
  workouts: WorkoutType[] | undefined;
  workout: WorkoutType | undefined;
  workoutStart: Date | undefined;
  timer: boolean;
}>();

const logged = defineModel<LoggedType>("logged");
const show = defineModel<any>("show");
const emit = defineEmits<{
  (emit: "stopTimer"): void;
}>();

const switchUser = () => {
  if (props.users && Object.keys(props.users).length === 2 && logged.value) {
    if (logged.value.user?.name === "Florian") {
      logged.value.user = {
        id: 2,
        name: props.users[1].name,
      };
    } else {
      logged.value.user = {
        id: 1,
        name: props.users[0].name,
      };
    }
    logged.value.isLogged = false;
    logged.value.loggedWorkoutId = undefined;
    show.value.showLogin = false;
  }
};

// Funktion zum Ausloggen
const logout = () => {
  logged.value = {
    isLogged: false,
    user: logged.value?.user,
    loggedWorkoutId: undefined,
  };
  show.value.showLogin = false;
  localStorage.removeItem("logged");
};
</script>

<template>
  <div
    class="sticky top-0 z-10 flex h-20 w-full items-center justify-between bg-sonja-text text-sonja-akz shadow mobile-landscape:hidden"
  >
    <!-- Profilepic -->
    <div @click.prevent="switchUser" class="h-full min-w-16 cursor-pointer">
      <img
        v-if="logged?.user?.name === 'Florian'"
        src="@/public/flo.jpg"
        class="min-w-18 max-h-full rounded-r-lg p-[1px] shadow shadow-sonja-akz"
        alt="Flo"
      />
      <img
        v-else
        class="max-h-full rounded-r-lg p-[1px] shadow shadow-sonja-akz"
        src="@/public/sonja.jpg"
        alt="Sonja"
      />
    </div>
    <!-- Status -->
    <h1
      v-if="logged?.user"
      class="flex flex-col text-2xl font-bold text-sonja-akz2"
    >
      Hallo Se Bebi {{ logged.user.name }}
      <Timer
        v-if="props.workout?.user_id && props.workout?.rest_time"
        :isActive="timer"
        :userId="props.workout?.user_id"
        :restTime="props.workout?.rest_time"
        @stopped="emit('stopTimer')"
      />
    </h1>
    <!-- Buttons -->
    <div class="mr-3 flex flex-col text-3xl">
      <!-- Start/End Workout -->
      <button v-if="logged?.isLogged" @click.prevent="logout">
        <i class="fa-solid fa-right-from-bracket" />
      </button>
      <div v-else>
        <button
          @click="
            {
              show.showLogin = !show.showLogin;
              show.showNew = false;
            }
          "
        >
          <i class="fa-solid fa-dumbbell" />
        </button>
        <Transition name="slide-fade-dropdown">
          <Start
            v-if="show.showLogin"
            v-outside
            v-model="logged"
            v-model:show="show"
            :workouts="workouts"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

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
