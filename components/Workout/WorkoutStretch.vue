<script setup lang="ts">
import useAddWorkoutExercise from "~/composables/useWorkoutExercise";
import BetterExerciseSelection from "../ExerciseSelection/BetterExerciseSelection.vue";
import Confirm from "../Dialogs/Confirm.vue";

const props = defineProps<{
  exercises: ExerciseType[] | undefined;
  categories: CategoryType[] | undefined;
  workout: WorkoutType | undefined;
}>();

const routerStore = useRouterStore();

const { data: workoutExercises } = useWorkoutExercisesByWorkout(
  computed(() => props.workout?.workout_id),
);
const workoutExercisesWithoutStretch = computed(() => {
  return workoutExercises.value?.filter((ex) =>
    ex.categories.some((c) => c.name === "Dehnen"),
  );
});

const showConfirmDeleteWorkoutExercise = ref<boolean>(false);
const wexIderciseToDelete = ref<number>();
const deleteMutation = useDeleteWorkoutExercise();
const removeWorkoutExercise = () => {
  if (wexIderciseToDelete.value) {
    deleteMutation.mutate(wexIderciseToDelete.value, {
      onSuccess: () => {
        showConfirmDeleteWorkoutExercise.value = false;
      },
    });
  }
};

// repeaded
const isOpenExerciseSelection = ref<boolean>(false);
const resultNewWorkoutExerciseId = ref<number>();
const mutation = useAddWorkoutExercise();
const addNewWorkoutExercise = (exercise_id: number) => {
  if (props.workout?.workout_id) {
    mutation.mutate(
      {
        workout_id: props.workout.workout_id,
        exercise_id: exercise_id,
      },
      {
        onSuccess: (res) => {
          if (props.exercises) {
            // routerStore.setWorkoutRoute("workoutexercisedetail");
          }
        },
        onError: (e) => console.error(e),
      },
    );
  }
};
watch(
  () => resultNewWorkoutExerciseId.value,
  (newVal) => {
    if (newVal) {
      addNewWorkoutExercise(newVal);
    }
  },
);
</script>

<template>
  <Header
    @right="routerStore.setWorkoutRoute('workoutdetail')"
    right-icon="fa-solid fa-repeat"
  >
    Stretches
  </Header>
  <div
    v-if="workoutExercises?.length !== 0"
    v-for="wex in workoutExercisesWithoutStretch"
    class="group relative flex cursor-pointer items-center justify-center rounded-full border-b border-sonja-bg-darker py-3"
  >
    {{ wex.exercise_name }}
    <button
      class="ml-2"
      @click.stop="
        showConfirmDeleteWorkoutExercise = true;
        wexIderciseToDelete = wex.workout_exercise_id;
      "
    >
      <i class="fa-solid fa-close text-3xl text-red-800" />
    </button>
    <!-- <button class="ml-2">
      <i class="fa-solid fa-chart-line text-sonja-fg" />
    </button>
    <button class="ml-2">
      <i class="fa-solid fa-edit text-sonja-text" />
    </button> -->
    <div class="absolute -top-1 right-auto z-0 flex gap-1">
      <UiChip
        v-for="category in wex.categories.filter((c) => c.name !== 'Dehnen')"
        :content="category.name"
        :type="category.type"
        animated
      />
    </div>
  </div>
  <button
    class="flex w-full justify-center rounded-full rounded-t bg-sonja-bg-darker pb-2 pt-3"
    @click="() => (isOpenExerciseSelection = true)"
  >
    <i class="fa-solid fa-plus text-5xl" />
  </button>
  <Confirm
    v-model:isOpen="showConfirmDeleteWorkoutExercise"
    @yes="removeWorkoutExercise"
  />
  <BetterExerciseSelection
    v-if="
      isOpenExerciseSelection && workout?.workout_id && categories && exercises
    "
    :categories="
      categories.filter((c) => c.name === 'Dehnen' || c.type === 'muscle')
    "
    :exercises="
      exercises.filter((ex) => ex.categories.some((c) => c.name === 'Dehnen'))
    "
    v-model:result="resultNewWorkoutExerciseId"
    @close="isOpenExerciseSelection = false"
  />
</template>
