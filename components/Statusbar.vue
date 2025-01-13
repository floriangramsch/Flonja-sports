<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import Start from "./Dialogs/Start.vue";
import Timer from "./Timer/Timer.vue";
import type Auth from "./Auth/Auth.vue";

const props = defineProps<{
  users: UserType[] | undefined;
  workouts: WorkoutType[] | undefined;
  workout: WorkoutType | undefined;
  timer: boolean;
}>();

const loggedStore = useLoggedStore();
const emit = defineEmits<{
  (emit: "stopTimer"): void;
}>();

const client = useQueryClient();

const wexToShow = useExToShowStore();

const switchUser = () => {
  if (props.users && loggedStore) {
    const userIndex = props.users.findIndex((user) => {
      const nameToSearch =
        loggedStore.logged.user?.name === "Florian" ? "Sonja" : "Florian";
      return user.name === nameToSearch;
    });
    const newIndex = userIndex;
    loggedStore.logged.user = {
      id: props.users[newIndex].user_id,
      name: props.users[newIndex].name,
    };
    loggedStore.logged.isLogged = false;
    loggedStore.logged.loggedWorkoutId = undefined;
    loggedStore.toStorage();
    wexToShow.reset();
    client.refetchQueries({ queryKey: ["plan"] });
  }
};

const { data: userImage } = useFile(
  computed(() => loggedStore.logged.user?.name),
);
</script>

<template>
  <div
    class="sticky top-0 z-10 flex h-20 w-full items-center justify-between bg-sonja-text text-sonja-akz shadow mobile-landscape:hidden"
  >
    <!-- Profilepic -->
    <div
      v-if="loggedStore.logged.user.id"
      @click.prevent="
        loggedStore.logged.user.name === 'Florian' ||
        loggedStore.logged.user.name === 'Sonja'
          ? switchUser()
          : ''
      "
      class="flex h-full w-16 items-center"
      :class="{
        'cursor-pointer':
          loggedStore.logged.user.name === 'Florian' ||
          loggedStore.logged.user.name === 'Sonja',
      }"
    >
      <!-- <div class="h-full w-16"> -->
      <img
        :src="userImage"
        class="max-h-full rounded-r-lg p-[1px] shadow shadow-sonja-akz"
        alt="no Img"
      />
    </div>
    <div v-else />
    <!-- Status -->
    <h1
      v-if="loggedStore.logged.user"
      class="flex flex-col text-2xl font-bold text-sonja-akz2"
    >
      Hallo
      {{
        loggedStore.logged.user.name === "Florian" ||
        loggedStore.logged.user.name === "Sonja"
          ? "Se Bebi"
          : ""
      }}
      {{ loggedStore.logged.user.name }}
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
