<script setup lang="ts">
import CategoryList from "./Categories/CategoryList.vue";
import WorkoutExerciseOverview from "./WorkoutExercises/WorkoutExerciseOverview.vue";
import ExerciseList from "./Exercises/ExerciseList.vue";
import Plan from "./Workout/Plan.vue";
import WorkoutPage from "./Workout/WorkoutPage.vue";
import WorkoutCalendar from "./Workout/WorkoutCalendar.vue";

defineProps<{ users: UserType[]; workouts: WorkoutType[] }>();

const workout = defineModel<WorkoutType | undefined>("workout");

const { data: exercises } = useExercises();
const { data: categories } = useCategories();
const router = useRouterStore()
</script>

<template>
  <div
    class="no-x-scrollbar relative flex flex-1 flex-grow flex-col overflow-y-auto bg-sonja-bg text-2xl text-sonja-text mobile-landscape:mt-0"
  >
    <Test v-route="'test'" />
    <Router route="workoutexercises">
      <WorkoutExerciseOverview v-model="exercises" />
    </Router>

    <Router route="plans">
      <Plan :workout="workout" />
    </Router>

    <Router route="workoutpage">
      <WorkoutPage
        :exercises="exercises"
        :categories="categories"
        :workout="workout"
      />
    </Router>

    <Router route="categorylist">
      <CategoryList v-if="categories" :categories="categories" />
    </Router>
    <Router route="exerciselist">
      <ExerciseList
        v-if="categories"
        :categories="categories"
        :users="users"
        :workout="workout"
      />
    </Router>

    <Router route="stats">
      <Stats :workout="workout" />
    </Router>
    <Router route="workouts">
      <WorkoutCalendar :workouts="workouts" :users="users" />
    </Router>
  </div>
</template>
