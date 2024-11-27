<script setup lang="ts">
import ExerciseOverview from "./Exercises/ExerciseOverview.vue";
import WorkoutOverview from "./Workout/WorkoutOverview.vue";
import WorkoutDetail from "./Workout/WorkoutDetail.vue";
import SlideTransition from "./ui/transitions/SlideTransition.vue";
import MuscleList from "./Muscles/MuscleList.vue";

defineProps<{ users: UserType; workouts: WorkoutType[] }>();

// Notifications
const registration = await navigator.serviceWorker.getRegistration();
const sendNotification = async () => {
  if (Notification.permission === "granted") {
    showNotification("test");
  } else {
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        showNotification("test");
      }
    }
  }
};

const showNotification = (body: any) => {
  const title = "What PWA Can Do Today";

  const payload = {
    body,
  };

  if (registration && "showNotification" in registration) {
    registration.showNotification(title, payload);
  } else {
    new Notification(title, payload);
  }
};

const logged = defineModel<LoggedType>("logged");
const show = defineModel<ShowType>("show");
const workout = defineModel<WorkoutType | undefined>("workout");

const { data: equips } = useEquips();
const { data: muscles } = useMuscles();

const exerciseFilter = ref<number[]>([]);
</script>

<template>
  <div
    class="flex flex-col flex-grow bg-sonja-bg text-sonja-text text-2xl flex-1 mt-20 overflow-y-auto relative no-x-scrollbar"
  >
    <SlideTransition>
      <div v-if="show.showRouter === 'exercises' && users">
        <ExerciseOverview v-model="equips" v-model:filter="exerciseFilter" />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="show.showRouter === 'musclelist' && muscles">
        <MuscleList :muscles="muscles" v-model:show="show" />
      </div>
      <div v-if="show?.showRouter === 'workoutdetail'" class="absolute inset-0">
        <WorkoutDetail
          :equips="equips"
          :muscles="muscles"
          :workout="workout"
          v-model:logged="logged"
        />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="show.showRouter === 'equiplist' && equips && muscles && users">
        <EquipList
          :equips="equips"
          :muscles="muscles"
          :users="users"
          :workout="workout"
          v-model:filter="exerciseFilter"
          v-model:show="show"
        />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="show.showRouter === 'workouts' && users && workouts">
        <WorkoutOverview
          :workouts="workouts"
          :users="users"
          v-model="logged"
          v-model:show="show"
        />
      </div>
      <button class="absolute top-1/2" @click="sendNotification">Note</button>
    </SlideTransition>

    <SlideTransition>
      <Stats v-if="show?.showRouter === 'stats' && logged" :logged="logged" />
    </SlideTransition>
  </div>
</template>
