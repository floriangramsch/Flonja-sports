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

const logged = defineModel<LoggedType>("logged");
const show = defineModel<ShowType>("show");
const workout = defineModel<WorkoutType | undefined>("workout");

const { data: exercises } = useExercises();
const { data: categories } = useCategories();

const workoutExerciseFilter = ref<number[]>([]);
</script>

<template>
  <div
    class="no-x-scrollbar relative flex flex-1 flex-grow flex-col overflow-y-auto bg-sonja-bg text-2xl text-sonja-text mobile-landscape:mt-0"
  >
    <Test v-if="show?.showRouter === 'test'" />
    <SlideTransition>
      <div v-if="show.showRouter === 'workoutexercises' && users">
        <WorkoutExerciseOverview v-model="exercises" v-model:filter="workoutExerciseFilter" />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="show.showRouter === 'categorylist' && categories">
        <CategoryList :categories="categories" v-model:show="show" />
      </div>
      <div v-if="show?.showRouter === 'workoutdetail'" class="absolute inset-0">
        <WorkoutDetail
          :exercises="exercises"
          :categories="categories"
          :workout="workout"
          v-model:logged="logged"
          v-model:filter="workoutExerciseFilter"
          v-model:show="show"
          @startTimer="$emit('startTimer')"
        />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="show.showRouter === 'exerciselist' && exercises && categories && users">
        <ExerciseList
          :categories="categories"
          :users="users"
          :workout="workout"
          v-model:filter="workoutExerciseFilter"
          v-model:show="show"
        />
      </div>
    </SlideTransition>
    <SlideTransition>
      <div v-if="show.showRouter === 'workouts' && users && workouts">
        <WorkoutList
          :workouts="workouts"
          :users="users"
          :workout="workout"
          v-model="logged"
          v-model:show="show"
        />
      </div>
    </SlideTransition>

    <SlideTransition>
      <Stats
        v-if="show?.showRouter === 'stats' && logged"
        :logged="logged"
        :workout="workout"
      />
    </SlideTransition>
  </div>
</template>
