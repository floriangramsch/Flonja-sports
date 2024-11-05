<script setup lang="ts">
import ExerciseOverview from "./Exercises/ExerciseOverview.vue";
import EquipSelection from "./Workout/EquipSelection.vue";
import WorkoutOverview from "./Workout/WorkoutOverview.vue";
import WorkoutDetail from "./Workout/WorkoutDetail.vue";
import Home from "./Home.vue";

defineProps<{ users: UserType; workouts: WorkoutType }>();

const logged = defineModel<LoggedType>("logged");
const show = defineModel<any>("show");
const loggedWorkout = defineModel<LoggedWorkout>("loggedWorkout");

const { data: equips } = useEquips();
const { data: muscles } = useMuscles();

const exerciseFilter = ref<number[]>([]);
</script>

<template>
  <div
    class="flex flex-col bg-sonja-bg text-sonja-text text-2xl flex-1 mt-20 mb-[5.7rem] overflow-y-auto relative no-x-scrollbar"
  >
    <Transition name="fade" mode="out-in">
      <div
        class="absolute inset-0"
        v-if="show.showRouter === 'exercises' && users"
      >
        <ExerciseOverview
          :users="users"
          v-model="equips"
          v-model:filter="exerciseFilter"
        />
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <div
        v-if="show.showRouter === 'workouts' && users && workouts"
        class="absolute inset-0"
      >
        <WorkoutOverview
          :workouts="workouts"
          :users="users"
          v-model="logged"
          v-model:showRouter="show.showRouter"
        />
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <div
        v-if="show.showRouter === 'equiplist' && equips && muscles && users"
        class="absolute inset-0"
      >
        <EquipList
          :equips="equips"
          :muscles="muscles"
          :users="users"
          :workout="loggedWorkout"
          v-model:filter="exerciseFilter"
          v-model:showRouter="show.showRouter"
        />
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <div
        v-if="show.showRouter === 'workoutdetail' && equips && loggedWorkout"
        class="absolute inset-0"
      >
        <WorkoutDetail
          :equips="equips"
          :workout="loggedWorkout"
          v-model="show"
        />
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <div v-if="show.showRouter === 'home'" class="absolute inset-0">
        <Home v-model="logged" />
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <div
        v-if="
          show.showRouter === 'equipselection' &&
          loggedWorkout?.id &&
          muscles &&
          equips
        "
        class="absolute inset-0"
      >
        <EquipSelection
          :workoutId="loggedWorkout.id"
          :muscles="muscles"
          :equips="equips"
          v-model="show"
        />
      </div>
    </Transition>
  </div>
</template>

<style>
.fade-enter-active {
  transition: all 0.1s ease-out;
}

.fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.no-x-scrollbar {
  overflow-x: hidden;
}
</style>
