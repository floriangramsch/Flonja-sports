<script setup lang="ts">
import useAddWorkoutExercise from "~/composables/useWorkoutExercise";
import Confirm from "../Dialogs/Confirm.vue";
import TimeLabel from "../ui/time-input/TimeLabel.vue";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";

const props = defineProps<{
  exercises: ExerciseType[] | undefined;
  categories: CategoryType[] | undefined;
  workout: WorkoutType | undefined;
}>();

const time = ref<number>();
const showUpdateTimeDialog = ref<boolean>(false);

const routerStore = useRouterStore();

const { data: workoutExercises } = useWorkoutCondiByWorkout(
  computed(() => props.workout?.workout_id),
);

const totalTime = computed(() => {
  return (
    workoutExercises.value?.reduce((sum, ex) => {
      return sum + Number(ex.weight ?? 0);
    }, 0) ?? 0
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

const mutation = useAddWorkoutExercise();
const addSetMutation = useAddSet();

const getTimeLabel = (time: number | undefined) => {
  if (!time) {
    return "Not started yet";
  }
  const hours = `${Math.floor(time / 3600)}h`;
  const minutes = `${Math.floor((time % 3600) / 60)}min`;
  const seconds = `${time % 60}s`;

  return `${hours} ${minutes} ${seconds}`;
};

const addNewWorkoutExercise = (exercise_id: number) => {
  if (props.workout?.workout_id) {
    mutation.mutate(
      {
        workout_id: props.workout.workout_id,
        exercise_id: exercise_id,
      },
      {
        onSuccess: (res) => {
          if (time.value && res.insertId) {
            addSetMutation.mutate({
              workout_exercise_id: res.insertId,
              weight: time.value,
              reps: 1,
            });
          }
        },
        onError: (e) => console.error(e),
      },
    );
  }
};

const listRef = ref<HTMLDivElement | null>(null);
watch(
  () => workoutExercises.value?.length,
  async (newLen, oldLen) => {
    if (!newLen || !oldLen) return;

    // nur wenn Liste wächst
    if (newLen <= oldLen) return;

    await nextTick();

    const el = listRef.value;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  },
);
</script>

<template>
  <Header
    @left="showUpdateTimeDialog = true"
    left-icon="fa-solid fa-clock"
    @right="routerStore.setWorkoutRoute('workoutstretch')"
    right-icon="fa-solid fa-repeat"
  >
    Condi
  </Header>

  <div class="flex justify-evenly">
    <Button @action="addNewWorkoutExercise(156)"> Gehen </Button>
    <Button @action="addNewWorkoutExercise(118)"> Joggen </Button>
  </div>

  <div
    ref="listRef"
    v-if="workoutExercises?.length !== 0"
    class="my-2 h-3/5 overflow-scroll border-y border-sonja-akz"
  >
    <div
      v-for="(wex, index) in workoutExercises"
      class="text-2 group relative flex cursor-pointer items-center justify-center rounded-full border-b border-sonja-bg-darker py-1"
    >
      {{ index + 1 }}. {{ Number(wex.weight) }}s {{ wex.name }}
      <button
        class="ml-2"
        @click.stop="
          showConfirmDeleteWorkoutExercise = true;
          wexIderciseToDelete = wex.workout_exercise_id;
        "
      >
        <i class="fa-solid fa-close text-2xl text-red-800" />
      </button>
    </div>
  </div>

  <div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
    <div class="text-lg opacity-80">Total time</div>
    <div class="text-3xl font-semibold">
      {{ getTimeLabel(totalTime) }}
    </div>
  </div>

  <Confirm
    v-model:isOpen="showConfirmDeleteWorkoutExercise"
    @yes="removeWorkoutExercise"
  />
  <Dialog
    :isOpen="showUpdateTimeDialog"
    @close="
      {
        showUpdateTimeDialog = false;
      }
    "
  >
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="mt-2 grid grid-cols-1 gap-2">
        <TimeLabel v-model:modelValue="time" :focus="true" :defaultValue="60" />
      </div>
      <Button @action="showUpdateTimeDialog = false"> Done </Button>
    </div>
  </Dialog>
</template>
