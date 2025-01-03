<script setup lang="ts">
import type {
  ExerciseType,
  MaybeWorkoutExercise,
  WorkoutExerciseType,
  WorkoutRouterTypes,
  WorkoutType,
} from "~/utils/types";
import WorkoutExerciseDetail from "./WorkoutExerciseDetail.vue";
import WorkoutRouter from "../Router/WorkoutRouter.vue";
import WorkoutStretch from "./WorkoutStretch.vue";

const props = defineProps<{
  exercises: ExerciseType[] | undefined;
  categories: CategoryType[] | undefined;
  workout: WorkoutType | undefined;
}>();

const loggedStore = useLoggedStore();
const routerStore = useRouterStore();
const wexToShow = useExToShowStore();

const { data: workoutExercises } = useWorkoutExercisesByWorkout(
  computed(() => props.workout?.workout_id),
);

const nextExercise = () => {
  if (!workoutExercises.value) return;
  const index = workoutExercises.value.findIndex(
    (ex) => ex.workout_exercise_id === wexToShow.wex?.workout_exercise_id,
  );
  if (index < workoutExercises.value.length - 1) {
    wexToShow.wex = workoutExercises.value[index + 1];
  } else {
    wexToShow.wex = workoutExercises.value[0];
  }
};

const prevExercise = () => {
  if (!workoutExercises.value) return;
  const index = workoutExercises.value?.findIndex(
    (ex) => ex.workout_exercise_id === wexToShow.wex?.workout_exercise_id,
  );
  if (index === 0) {
    wexToShow.wex = workoutExercises.value[workoutExercises.value.length - 1];
  } else {
    wexToShow.wex = workoutExercises.value[index - 1];
  }
};

const checkWex = (
  wex: MaybeWorkoutExercise | undefined,
): WorkoutRouterTypes => {
  if (wex?.workout_exercise_id) {
    if (wex.categories.every((c) => c.name !== "Dehnen")) {
      return "workoutexercisedetail";
    } else {
      return "workoutstretch";
    }
  }
  return "workoutdetail";
};

routerStore.setWorkoutRoute(
  loggedStore.logged.loggedWorkoutId ? checkWex(wexToShow.wex) : "home",
);
</script>

<template>
  <WorkoutRouter route="home">
    <Home />
  </WorkoutRouter>

  <!-- Workout Exercises List -->
  <WorkoutRouter route="workoutdetail">
    <WorkoutDetail
      :exercises="exercises"
      :categories="categories"
      :workout="workout"
    />
  </WorkoutRouter>

  <WorkoutRouter route="workoutstretch">
    <WorkoutStretch
      :exercises="exercises"
      :categories="categories"
      :workout="workout"
    />
  </WorkoutRouter>

  <!-- Workout Exercise Detail -->
  <WorkoutRouter route="workoutexercisedetail">
    <WorkoutExerciseDetail
      v-if="workout?.start && workout.user_id && wexToShow.wex"
      :workout-info="{
        start: workout.start,
        user_id: workout.user_id,
        rest_time: workout.rest_time,
      }"
      :exercise="
        exercises?.find(
          (e: ExerciseType) => e.exercise_id === wexToShow.wex?.exercise_id,
        )
      "
      @close="
        wexToShow.reset();
        routerStore.setWorkoutRoute('workoutdetail');
      "
      @next="nextExercise"
      @prev="prevExercise"
    />
  </WorkoutRouter>
</template>
