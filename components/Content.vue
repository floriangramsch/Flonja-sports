<script setup lang="ts">
import WorkoutList from "./Workout/WorkoutList.vue";
import WorkoutDetail from "./Workout/WorkoutDetail.vue";
import CategoryList from "./Categories/CategoryList.vue";
import WorkoutExerciseOverview from "./WorkoutExercises/WorkoutExerciseOverview.vue";
import ExerciseList from "./Exercises/ExerciseList.vue";

defineProps<{ users: UserType; workouts: WorkoutType[] }>();

defineEmits<{
  (emits: "startTimer"): void;
}>();

const workout = defineModel<WorkoutType | undefined>("workout");

const { data: exercises } = useExercises();
const { data: categories } = useCategories();
</script>

<template>
  <div
    class="no-x-scrollbar relative flex flex-1 flex-grow flex-col overflow-y-auto bg-sonja-bg text-2xl text-sonja-text mobile-landscape:mt-0"
  >
    <Test v-route="'test'"  />
    <Router route="workoutexercises">
      <WorkoutExerciseOverview
        v-model="exercises"
      />
    </Router>

    <Router route="workouts">
      <WorkoutList :workouts="workouts" :users="users" :workout="workout" />
    </Router>

    <Router route="workoutdetail">
      <WorkoutDetail
        :exercises="exercises"
        :categories="categories"
        :workout="workout"
        @startTimer="$emit('startTimer')"
      />
    </Router>

    <Router route="categorylist">
      <CategoryList v-if="categories" :categories="categories" />
    </Router>
    <Router route="exerciselist">
      <ExerciseList
        v-if="
          categories
        "
        :categories="categories"
        :users="users"
        :workout="workout"
      />
    </Router>
    
    <Router route="stats">
      <Stats :workout="workout" />
    </Router>
  </div>
</template>
