<template>
  <div
    v-if="
      isUsersSuccess && isEquipsSuccess && isMusclesSuccess && isWorkoutsSuccess
    "
  >
    <div class="flex flex-col bg-sonja-bg text-sonja-text h-screen text-2xl">
      <div>
        <div class="absolute left-1">
          <a @click.prevent="switchUser" class="ml-auto cursor-pointer">
            <img
              v-if="logged.user?.name === 'Florian'"
              src="@/public/flo.jpg"
              class="max-h-[9vh] max-w-[9vh]"
            />
            <img
              v-else
              class="max-h-[9vh] max-w-[9vh]"
              src="@/public/sonja.jpg"
            />
          </a>
        </div>
        <div class="absolute right-1">
          <a @click.prevent="handleRefresh" class="ml-auto cursor-pointer">
            <i class="fa-solid fa-rotate-right text-sonja-akz"></i>
          </a>
        </div>
        <div class="absolute right-1 top-10">
          <button
            @click="
              {
                showNew.show = !showNew.show;
                showLogin = false;
              }
            "
            class="text-sonja-akz cursor-pointer"
          >
            <i class="fa-solid fa-plus text-3xl"></i>
          </button>
          <div v-if="showNew.show">
            <div
              class="absolute top-2 right-10 bg-sonja-akz rounded-md shadow-lg"
            >
              <button
                @click="showNew.showDialogEquip = !showNew.showDialogEquip"
                class="flex px-4 py-2 cursor-pointer"
              >
                Neuer Muskle
              </button>
              <button
                @click="showNew.showDialogMuskle = !showNew.showDialogMuskle"
                class="flex px-4 py-2 cursor-pointer"
              >
                Neues Gerät
              </button>
            </div>
            <Dialog
              :isOpen="showNew.showDialogEquip"
              @close="
                showNew.showDialogEquip = false;
                showNew.show = false;
              "
            >
              <NewMuskle
                v-model:muscles="muscles"
                @close="
                  showNew.showDialogMuskle = false;
                  showNew.show = false;
                "
              />
            </Dialog>
            <Dialog
              :isOpen="showNew.showDialogMuskle"
              @close="
                showNew.showDialogMuskle = false;
                showNew.show = false;
              "
            >
              <NewEquip
                v-if="muscles"
                :muscles="muscles"
                v-model:equips="equips"
                @close="
                  showNew.showDialogEquip = false;
                  showNew.show = false;
                "
              />
            </Dialog>
          </div>
        </div>
      </div>
      <template v-if="logged.user">
        <div class="mb-20">
          <h1
            class="absolute left-1/4 justify-center text-sonja-text text-1xl rounded bg-sonja-fg bg-opacity-25 backdrop-blur-md p-1"
          >
            Hallo Se Bebi {{ logged.user?.name }}
            <br />
            {{ formatTime(loggedWorkout?.start) }}
          </h1>
        </div>
      </template>
      <ExerciseOverview
        v-if="showRouter === 'exercises' && users"
        :users="users"
        v-model="equips"
        v-model:filter="exerciseFilter"
      />
      <WorkoutOverview
        v-if="showRouter === 'workouts' && users && workouts"
        :workouts="workouts"
        :users="users"
        v-model="logged"
        v-model:showRouter="showRouter"
      />
      <EquipList
        v-if="showRouter === 'equiplist' && equips && muscles && users"
        :equips="equips"
        :muscles="muscles"
        :users="users"
        :workout="loggedWorkout"
        v-model:filter="exerciseFilter"
        v-model:showRouter="showRouter"
      />
      <Home v-if="showRouter === 'home'" />
    </div>
  </div>
  <div v-else>Loading...</div>
  <nav class="fixed bottom-0 w-full">
    <div
      class="flex justify-evenly bg-sonja-fg border-t-2 border-sonja-fg-darker text-sonja-text"
    >
      <div class="flex-grow">
        <button
          @click="
            showRouter !== 'exercises'
              ? (showRouter = 'exercises')
              : (showRouter = 'equiplist')
          "
          class="text-lg border-sonja-fg pt-2 pb-10 w-full"
        >
          <i class="fa-solid fa-chart-line text-4xl" />
        </button>
      </div>

      <div v-if="logged.isLogged" class="flex-grow">
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
              showLogin = !showLogin;
              showNew.show = false;
            }
          "
          class="text-lg border-sonja-fg pt-2 pb-10 w-full"
        >
          <i class="fa-solid fa-dumbbell text-4xl"></i>
        </button>
        <Start
          v-if="showLogin"
          v-outside
          v-model="logged"
          v-model:workouts="workouts"
        />
      </div>
      <div class="flex-grow">
        <button
          @click="
            showRouter !== 'workouts'
              ? (showRouter = 'workouts')
              : (showRouter = 'equiplist')
          "
          class="text-lg border-sonja-fg pt-2 pb-10 w-full"
        >
          <i class="fa-solid fa-calendar text-4xl"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Dialog from "@/components/Dialogs/Dialog.vue";
import NewEquip from "@/components/Dialogs/NewEquip.vue";
import NewMuskle from "@/components/Dialogs/NewMuskle.vue";
import Start from "@/components/Dialogs/Start.vue";
import EquipList from "@/components/Equip/EquipList.vue";
import ExerciseOverview from "@/components/Exercises/ExerciseOverview.vue";
import WorkoutOverview from "@/components/Workout/WorkoutOverview.vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

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

const showNew = ref({
  show: false, // show dropdown
  showDialogEquip: false, // show equip dialog
  showDialogMuskle: false, // show muscle dialog
});
const showLogin = ref(false);
const showRouter = ref("equiplist");
// const showRouter = ref("home");

const exerciseFilter = ref<number[]>([]);

const logged: Ref<LoggedType> = ref({
  isLogged: false,
  user: undefined,
  test: 18,
});

const loggedWorkout = computed(() => {
  if (workouts.value) {
    const lWorkout = logged.value.test
      ? workouts.value[logged.value.test]
      : undefined;
    if (lWorkout) {
      return { id: logged.value.test, ...lWorkout };
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

// Funktion zum Ausloggen
const logout = () => {
  logged.value = {
    isLogged: false,
    user: logged.value.user,
    test: undefined,
  };
  showLogin.value = false;
  localStorage.removeItem("logged");
};

onMounted(() => {
  loadLoggedState();
});

// Beobachte Änderungen im Anmeldezustand und speichere diese
watch(logged, saveLoggedState, { deep: true });

const handleRefresh = async () => {
  queryClient.invalidateQueries({ queryKey: ["users"] });
  queryClient.invalidateQueries({ queryKey: ["muscles"] });
  queryClient.invalidateQueries({ queryKey: ["workouts"] });
  queryClient.invalidateQueries({ queryKey: ["equips"] });
};

// tbd
const switchUser = () => {
  if (users.value && Object.keys(users.value).length === 2) {
    if (logged.value.user?.name === "Florian") {
      logged.value.user = {
        id: 2,
        name: users.value[1].name,
      };
    } else {
      logged.value.user = {
        id: 1,
        name: users.value[0].name,
      };
    }
    logged.value.isLogged = false;
    logged.value.test = undefined;
    showLogin.value = false;
  }
};
</script>
