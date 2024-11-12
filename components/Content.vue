<script setup lang="ts">
import ExerciseOverview from "./Exercises/ExerciseOverview.vue";
import WorkoutOverview from "./Workout/WorkoutOverview.vue";
import WorkoutDetail from "./Workout/WorkoutDetail.vue";
import SlideTransition from "./ui/transitions/SlideTransition.vue";

defineProps<{ users: UserType; workouts: WorkoutType[] }>();

const logged = defineModel<LoggedType>("logged");
const show = defineModel<ShowType>("show");
const workout = defineModel<WorkoutType | undefined>("workout");

const { data: equips } = useEquips();
const { data: muscles } = useMuscles();

const exerciseFilter = ref<number[]>([]);
</script>

<template>
  <div
    class="flex flex-col bg-sonja-bg text-sonja-text text-2xl flex-1 mt-20 mb-[5.7rem] overflow-y-auto relative no-x-scrollbar"
  >
    <SlideTransition>
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
    </SlideTransition>
    <SlideTransition>
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
      <div
        v-if="show.showRouter === 'equiplist' && equips && muscles && users"
        class="absolute inset-0"
      >
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
      <div
        v-if="show.showRouter === 'workouts' && users && workouts"
        class="absolute inset-0"
      >
        <WorkoutOverview
          :workouts="workouts"
          :users="users"
          v-model="logged"
          v-model:show="show"
        />
      </div>
    </SlideTransition>
  </div>
</template>
