<script setup lang="ts">
import Dialog from "./Dialogs/Dialog.vue";
import NewMuskle from "./Dialogs/NewMuskle.vue";
import NewEquip from "./Dialogs/NewEquip.vue";
import Start from "./Dialogs/Start.vue";

const props = defineProps<{
  users: UserType | undefined;
  workouts: WorkoutType[] | undefined;
  workoutStart: Date | undefined;
}>();

const logged = defineModel<LoggedType>("logged");
const show = defineModel<any>("show");

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
  show.value.showRouter = "workoutdetail";
  localStorage.removeItem("logged");
};

const refresh = useRefresh();

const handleRefresh = async () => {
  await refresh();
};
</script>

<template>
  <div
    class="flex justify-between items-center fixed text-sonja-akz top-0 w-full bg-sonja-fg h-20 z-10"
  >
    <div class="h-full">
      <a @click.prevent="switchUser" class="cursor-pointer">
        <img
          v-if="logged?.user?.name === 'Florian'"
          src="@/public/flo.jpg"
          class="max-h-full p-[1px] rounded-r-lg shadow shadow-sonja-akz"
        />
        <img
          v-else
          class="max-h-full p-[1px] rounded-r-lg shadow shadow-sonja-akz"
          src="@/public/sonja.jpg"
        />
      </a>
    </div>
    <h1
      v-if="logged?.user"
      class="self-start text-sonja-text text-2xl rounded bg-sonja-bg bg-opacity-25 backdrop-blur-md p-1 shadow"
    >
      Hallo Se Bebi {{ logged.user?.name }}
      <br />
      {{ formatTime(workoutStart) }}
    </h1>
    <div class="grid grid-cols-2">
      <div>
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
        <Transition name="slide-fade-dropdown">
          <div
            v-if="show.showNew"
            class="absolute top-1 right-20 bg-sonja-akz text-xl text-sonja-text z-10 rounded-md shadow-lg"
          >
            <button
              @click="
                show.showDialogMuskle = true;
                show.showNew = false;
              "
              class="flex px-4 py-2 cursor-pointer"
            >
              Neuer Muskle
            </button>
            <button
              @click="
                show.showDialogEquip = true;
                show.showNew = false;
              "
              class="flex px-4 py-2 cursor-pointer"
            >
              Neues Gerät
            </button>
          </div>
        </Transition>
        <Dialog
          :isOpen="show.showDialogMuskle"
          @close="
            show.showDialogEquip = false;
            show.showDialogMuskle = false;
            show.showNew = false;
          "
        >
          <NewMuskle
            @close="
              show.showDialogEquip = false;
              show.showDialogMuskle = false;
              show.showNew = false;
            "
          />
        </Dialog>
        <Dialog
          :isOpen="show.showDialogEquip"
          @close="
            show.showDialogEquip = false;
            show.showDialogMuskle = false;
            show.showNew = false;
          "
        >
          <NewEquip
            @close="
              show.showDialogEquip = false;
              show.showDialogMuskle = false;
              show.showNew = false;
            "
          />
        </Dialog>
      </div>
      <div>
        <a @click.prevent="handleRefresh" class="ml-auto cursor-pointer">
          <i class="fa-solid fa-rotate-right text-3xl"></i>
        </a>
      </div>
      <div v-if="logged?.isLogged" class="col-start-2 row-start-2">
        <button @click.prevent="logout">
          <i class="fa-solid fa-cat text-3xl"></i>
        </button>
      </div>
      <div v-else class="col-start-2 row-start-2">
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
