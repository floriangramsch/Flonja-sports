<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import Dialog from "./Dialogs/Dialog.vue";
import NewMuskle from "./Dialogs/NewMuskle.vue";
import NewEquip from "./Dialogs/NewEquip.vue";
import Start from "./Dialogs/Start.vue";

const props = defineProps<{
  users: UserType | undefined;
  workouts: WorkoutType | undefined;
  workoutStart: Date | undefined;
}>();

const logged = defineModel<any>("logged");
const show = defineModel<any>("show");

const switchUser = () => {
  if (props.users && Object.keys(props.users).length === 2) {
    if (logged.value.name === "Florian") {
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
    logged.value.loggedWorkout = undefined;
    show.value.showLogin = false;
  }
};

const queryClient = useQueryClient();
const handleRefresh = async () => {
  queryClient.invalidateQueries({ queryKey: ["users"] });
  queryClient.invalidateQueries({ queryKey: ["muscles"] });
  queryClient.invalidateQueries({ queryKey: ["workouts"] });
  queryClient.invalidateQueries({ queryKey: ["equips"] });
};

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
  <div class="fixed text-sonja-akz top-0 w-full bg-sonja-fg h-20">
    <h1
      v-if="logged.user"
      class="absolute left-[18%] justify-center text-sonja-text text-2xl rounded bg-sonja-bg bg-opacity-25 backdrop-blur-md p-1"
    >
      Hallo Se Bebi {{ logged.user?.name }}
      <br />
      {{ formatTime(workoutStart) }}
    </h1>
    <div class="absolute left-1">
      <a @click.prevent="switchUser" class="ml-auto cursor-pointer">
        <img
          v-if="logged.user?.name === 'Florian'"
          src="@/public/flo.jpg"
          class="max-h-[9vh] max-w-[9vh]"
        />
        <img v-else class="max-h-[9vh] max-w-[9vh]" src="@/public/sonja.jpg" />
      </a>
    </div>
    <div class="absolute right-1">
      <a @click.prevent="handleRefresh" class="ml-auto cursor-pointer">
        <i class="fa-solid fa-rotate-right text-3xl"></i>
      </a>
    </div>
    <div v-if="logged?.isLogged" class="absolute top-10 right-1">
      <button @click.prevent="logout">
        <i class="fa-solid fa-cat text-3xl"></i>
      </button>
    </div>
    <div v-else class="absolute top-10 right-1">
      <button
        @click="
          {
            show.showLogin = !show.showLogin;
            show.showNew = false;
          }
        "
      >
        <i class="fa-solid fa-dumbbell text-3xl"></i>
      </button>
      <Start
        v-if="show.showLogin"
        v-outside
        v-model="logged"
        :workouts="workouts"
      />
    </div>
    <div class="absolute right-10">
      <button
        @click="
          {
            show.showNew = !show.showNew;
            show.showLogin = false;
          }
        "
        class="cursor-pointer"
      >
        <i class="fa-solid fa-plus text-4xl"></i>
      </button>
      <div v-if="show.showNew">
        <div
          class="absolute top-1 right-9 bg-sonja-akz text-xl text-sonja-text z-10 rounded-md shadow-lg"
        >
          <button
            @click="show.showDialogEquip = !show.showDialogEquip"
            class="flex px-4 py-2 cursor-pointer"
          >
            Neuer Muskle
          </button>
          <button
            @click="show.showDialogMuskle = !show.showDialogMuskle"
            class="flex px-4 py-2 cursor-pointer"
          >
            Neues Gerät
          </button>
        </div>
        <Dialog
          :isOpen="show.showDialogEquip"
          @close="
            show.showDialogEquip = false;
            show.showNew = false;
          "
        >
          <NewMuskle
            @close="
              show.showDialogMuskle = false;
              show.showNew = false;
            "
          />
        </Dialog>
        <Dialog
          :isOpen="show.showDialogMuskle"
          @close="
            show.showDialogMuskle = false;
            show.showNew = false;
          "
        >
          <NewEquip
            @close="
              show.showDialogEquip = false;
              show.showNew = false;
            "
          />
        </Dialog>
      </div>
    </div>
  </div>
</template>
