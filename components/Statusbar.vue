<script setup lang="ts">
import Start from "./Dialogs/Start.vue";
import Timer from "./Timer/Timer.vue";

const props = defineProps<{
  users: UserType | undefined;
  workouts: WorkoutType[] | undefined;
  workout: WorkoutType | undefined;
  timer: boolean;
}>();

const loggedStore = useLoggedStore()
const emit = defineEmits<{
  (emit: "stopTimer"): void;
}>();

const switchUser = () => {
  if (props.users && Object.keys(props.users).length === 2 && loggedStore) {
    if (loggedStore.logged.user?.name === "Florian") {
      loggedStore.logged.user = {
        id: 2,
        name: props.users[1].name,
      };
    } else {
      loggedStore.logged.user = {
        id: 1,
        name: props.users[0].name,
      };
    }
    loggedStore.logged.isLogged = false;
    loggedStore.logged.loggedWorkoutId = undefined;
    loggedStore.toStorage()
  }
};

</script>

<template>
  <div
    class="sticky top-0 z-10 flex h-20 w-full items-center justify-between bg-sonja-text text-sonja-akz shadow mobile-landscape:hidden"
  >
    <!-- Profilepic -->
    <div @click.prevent="switchUser" class="h-full w-16 cursor-pointer">
      <img
        v-if="loggedStore.logged.user?.name === 'Florian'"
        src="@/public/flo.jpg"
        class="max-h-full rounded-r-lg p-[1px] shadow shadow-sonja-akz"
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
      v-if="loggedStore.logged.user"
      class="flex flex-col text-2xl font-bold text-sonja-akz2"
    >
      Hallo Se Bebi {{ loggedStore.logged.user.name }}
      <Timer
        v-if="props.workout?.user_id && props.workout?.rest_time"
        :isActive="timer"
        :userId="props.workout?.user_id"
        :restTime="props.workout?.rest_time"
        @stopped="emit('stopTimer')"
      />
    </h1>
    <div class="mr-3 flex flex-col text-3xl">
      <!-- Start/End Workout -->
      <Start :workouts="workouts" />
    </div>
  </div>
</template>
