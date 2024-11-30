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
    class="sticky flex justify-between items-center text-sonja-akz top-0 w-full bg-sonja-text h-20 z-10 shadow mobile-landscape:hidden"
  >
    <!-- Profilepic -->
    <div @click.prevent="switchUser" class="h-full min-w-16 cursor-pointer">
      <img
        v-if="logged?.user?.name === 'Florian'"
        src="@/public/flo.jpg"
        class="max-h-full min-w-18 p-[1px] rounded-r-lg shadow shadow-sonja-akz"
        alt="Flo"
      />
      <img
        v-else
        class="max-h-full p-[1px] rounded-r-lg shadow shadow-sonja-akz"
        src="@/public/sonja.jpg"
        alt="Sonja"
      />
    </div>
    <!-- Status -->
    <h1
      v-if="logged?.user"
      class="text-sonja-akz2 font-bold text-2xl flex flex-col"
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
    <div class="flex flex-col mr-3 text-3xl">
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
