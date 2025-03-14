<script setup lang="ts">
import useAddWorkoutExercise from "~/composables/useWorkoutExercise";
import Confirm from "../Dialogs/Confirm.vue";
import UpdateExercise from "../Exercises/UpdateExercise.vue";
import Header from "../Header/Header.vue";
import BetterExerciseSelection from "../ExerciseSelection/BetterExerciseSelection.vue";

const props = defineProps<{
  exercises: ExerciseType[] | undefined;
  categories: CategoryType[] | undefined;
  workout: WorkoutType | undefined;
}>();

const { data: workoutExercises } = useWorkoutExercisesByWorkout(
  computed(() => props.workout?.workout_id),
);

const workoutExercisesWithoutStretch = computed(() => {
  return workoutExercises.value?.filter((ex) =>
    ex.categories.every((c) => c.name !== "Dehnen"),
  );
});

const filterStore = useWorkoutExerciseFilterStore();
const routerStore = useRouterStore();
const wexToShow = useExToShowStore();

const updateWorkoutMutation = useUpdateWorkout();
const endWorkout = () => {
  if (props.workout?.workout_id && !props.workout.end) {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const end = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    updateWorkoutMutation.mutate(
      {
        updatedData: `end = '${end}'`,
        workout_id: props.workout?.workout_id,
      },
      {
        onSuccess: () => {
          showConfirmEndWorkout.value = false;
        },
      },
    );
  }
};
const showConfirmEndWorkout = ref<boolean>(false);

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
            const exercise = props.exercises.find(
              (ex) => ex.exercise_id === exercise_id,
            );
            if (exercise) {
              wexToShow.wex = {
                exercise_name: exercise?.exercise_name,
                exercise_id: exercise_id,
                categories: exercise.categories,
                workout_exercise_id: res.insertId,
                type: exercise?.type,
                metric: exercise?.metric,
              };
            }
            routerStore.setWorkoutRoute("workoutexercisedetail");
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

const isOpenExerciseSelection = ref<boolean>(false);
const updateExerciseRef = ref<InstanceType<typeof UpdateExercise> | null>(null);
</script>

<template>
  <Header
    @right="routerStore.setWorkoutRoute('workoutstretch')"
    right-icon="fa-solid fa-repeat"
  >
    Exercises
    <template #left-pure>
      <Confirm
        v-model:isOpen="showConfirmEndWorkout"
        @yes="endWorkout"
        class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        :disabled="workout?.end ? true : false"
      >
        <i class="fa-solid fa-cat" :class="workout?.end ? 'opacity-50' : ''" />
      </Confirm>
    </template>
  </Header>

  <UpdateExercise
    v-if="categories"
    ref="updateExerciseRef"
    :categories="categories"
  />
  <div
    v-if="workoutExercises?.length !== 0"
    v-for="wex in workoutExercisesWithoutStretch"
    class="group relative flex cursor-pointer items-center justify-center rounded-full border-b border-sonja-bg-darker py-3"
    @click="
      wexToShow.wex = wex;
      routerStore.setWorkoutRoute('workoutexercisedetail');
    "
  >
    <div class="max-w-fit px-1 overflow-scroll text-nowrap">
      {{ wex.exercise_name }}
    </div>
    <button
      class="ml-2"
      @click.stop="
        filterStore.setId(wex.exercise_id);
        routerStore.setRoute('workoutexercises');
      "
    >
      <i class="fa-solid fa-chart-line text-sonja-fg" />
    </button>
    <button
      class="ml-2"
      @click.stop="
        updateExerciseRef?.setForm({
          exercise_name: wex.exercise_name,
          exercise_id: wex.exercise_id,
          categories: wex.categories.map((c) => c.id),
          type: wex.type,
          metric: wex.metric,
        });
        updateExerciseRef?.open();
      "
    >
      <i class="fa-solid fa-edit text-sonja-text" />
    </button>
    <div class="absolute -top-1 right-auto z-0 flex gap-1">
      <UiChip
        v-for="category in wex.categories"
        :content="category.name"
        :type="category.type"
        animated
      />
      <UiChip :content="wex.metric" type="metric" animated />
      <UiChip :content="wex.type" type="exerciseType" animated />
    </div>
  </div>
  <div v-else>
    <div
      class="flex h-20 w-full cursor-pointer items-center justify-center bg-sonja-bg-darker text-3xl font-bold"
      @click="() => (isOpenExerciseSelection = true)"
    >
      Start Workout
    </div>
  </div>
  <button
    class="flex w-full justify-center rounded-full rounded-t bg-sonja-bg-darker pb-2 pt-3"
    @click="() => (isOpenExerciseSelection = true)"
  >
    <i class="fa-solid fa-plus text-5xl" />
  </button>

  <BetterExerciseSelection
    v-if="
      isOpenExerciseSelection && workout?.workout_id && categories && exercises
    "
    :categories="categories.filter((c) => c.name !== 'Dehnen')"
    :exercises="
      exercises.filter((ex) => ex.categories.every((c) => c.name !== 'Dehnen'))
    "
    v-model:result="resultNewWorkoutExerciseId"
    @close="isOpenExerciseSelection = false"
  />
</template>
