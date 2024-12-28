<script setup lang="ts">
import WorkoutList from "./Workout/WorkoutList.vue";
import WorkoutDetail from "./Workout/WorkoutDetail.vue";
import SlideTransition from "./ui/transitions/SlideTransition.vue";
import CategoryList from "./Categories/CategoryList.vue";
import WorkoutExerciseOverview from "./WorkoutExercises/WorkoutExerciseOverview.vue";
import ExerciseList from "./Exercises/ExerciseList.vue";

defineProps<{ users: UserType; workouts: WorkoutType[] }>();

defineEmits<{
  (emits: "startTimer"): void;
}>();

const routerStore = useRouterStore();
const workout = defineModel<WorkoutType | undefined>("workout");

const { data: exercises } = useExercises();
const { data: categories } = useCategories();

const workoutExerciseFilter = ref<number[]>([]);
</script>

<template>
  <div
    class="no-x-scrollbar relative flex flex-1 flex-grow flex-col overflow-y-auto bg-sonja-bg text-2xl text-sonja-text mobile-landscape:mt-0"
  >
    <!-- <Test v-route="'test'"  /> -->
    <SlideTransition>
      <div v-if="routerStore.route === 'workoutexercises' && users">
        <WorkoutExerciseOverview
          v-model="exercises"
          v-model:filter="workoutExerciseFilter"
        />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="routerStore.route === 'categorylist' && categories">
        <CategoryList :categories="categories" />
      </div>
      <div
        v-if="routerStore.route === 'workoutdetail'"
        class="absolute inset-0"
      >
        <WorkoutDetail
          :exercises="exercises"
          :categories="categories"
          :workout="workout"
          v-model:filter="workoutExerciseFilter"
          @startTimer="$emit('startTimer')"
        />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div
        v-if="
          routerStore.route === 'exerciselist' &&
          exercises &&
          categories &&
          users
        "
      >
        <ExerciseList
          :categories="categories"
          :users="users"
          :workout="workout"
          v-model:filter="workoutExerciseFilter"
        />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="routerStore.route === 'workouts' && users && workouts">
        <WorkoutList :workouts="workouts" :users="users" :workout="workout" />
      </div>
    </SlideTransition>

    <SlideTransition>
      <Stats v-if="routerStore.route === 'stats'" :workout="workout" />
    </SlideTransition>
  </div>
</template>
