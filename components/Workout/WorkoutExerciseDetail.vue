<script setup lang="ts">
import { useGetSetsByExerciseId } from "~/composables/useSets";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Confirm from "../Dialogs/Confirm.vue";
import TextareaInfo from "../ui/inputs/TextareaInfo.vue";

const props = defineProps<{
  workoutExercise: WorkoutExerciseType;
  workoutInfo: {
    start: Date;
    user_id: number;
    rest_time: number;
  };
  exercise: ExerciseType | undefined;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (emits: "startTimer"): void;
}>();

const mutation = useDeleteWorkoutExercise();
const deleteSetMutation = useDeleteSet();
const { data: sets } = useGetSetsByExerciseId(
  props.workoutExercise.workout_exercise_id,
);
const addSetMutation = useAddSet();
const updateSetMutaiton = useUpdateSet();
const { data: lastSets } = useGetLastSets({
  exercise_id: props.workoutExercise.exercise_id,
  user_id: props.workoutInfo?.user_id,
  start: props.workoutInfo?.start,
});

const removeWorkoutExercise = () => {
  mutation.mutate(props.workoutExercise.workout_exercise_id, {
    onSuccess: () => {
      showConfirmDeleteWorkoutExercise.value = false;
      emit("close");
    },
  });
};

const setToDelete = ref<number>();
const removeSet = (id: number) => {
  deleteSetMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteSet.value = false),
  });
};

const handleSet = () => {
  if (newWeight.value !== undefined && newReps.value !== undefined) {
    if (setIdToUpdate.value) {
      updateSetMutaiton.mutate(
        {
          set_id: setIdToUpdate.value,
          weight: newWeight.value,
          reps: newReps.value,
        },
        {
          onSuccess: () => {
            showOldSets.value = false;
            showUpdateWorkoutExerciseDialog.value = false;
            // newWeight.value = undefined;
            newReps.value = undefined;
          },
        },
      );
    } else {
      addSetMutation.mutate(
        {
          workout_exercise_id: props.workoutExercise.workout_exercise_id,
          weight: newWeight.value,
          reps: newReps.value,
        },
        {
          onSuccess: () => {
            showOldSets.value = false;
            showUpdateWorkoutExerciseDialog.value = false;
            newReps.value = undefined;
            emit("startTimer");
          },
        },
      );
    }
  }
};

const showUpdateWorkoutExerciseDialog = ref<boolean>(false);
const showConfirmDeleteSet = ref<boolean>(false);
const showConfirmDeleteWorkoutExercise = ref<boolean>(false);
const showOldSets = ref<boolean>(false);
const showInfo = ref<boolean>(false);
const editInfo = ref<boolean>(!props.exercise?.info);

const newWeight = ref<number>();
const newReps = ref<number>();
const setIdToUpdate = ref<number>();

watch(
  () => sets.value,
  (newVal) => {
    showOldSets.value =
      newVal.length === 0 && lastSets.value && lastSets.value?.length !== 0;
  },
);
</script>

<template>
  <div class="absolute inset-0 pb-52">
    <!-- Header -->
    <div class="flex w-full justify-evenly px-4 py-4">
      <button
        class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="emit('close')"
      >
        <i class="fa-solid fa-arrow-left" />
      </button>
      <div class="text-center text-4xl font-bold">
        {{ workoutExercise.exercise_name }}
      </div>
      <Confirm
        v-model:isOpen="showConfirmDeleteWorkoutExercise"
        @yes="removeWorkoutExercise"
        class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-red-800 shadow"
      >
        <i class="fa-solid fa-close" />
      </Confirm>
    </div>
    <!-- Buttons -->
    <div class="mb-5 flex w-full justify-center">
      <!-- Switch between current and old sets -->
      <button
        class="text-3xl"
        :class="lastSets?.length === 0 ? 'opacity-50' : ''"
        :disabled="lastSets?.length === 0"
        @click="showOldSets = !showOldSets"
      >
        <i class="fa-solid fa-repeat" />
      </button>
      <!-- Open Info -->
      <button
        class="absolute right-9 text-3xl text-sonja-text"
        @click="showInfo = true"
      >
        <i class="fa-solid fa-info" />
      </button>
    </div>
    <!-- Sets -->
    <div>
      <!-- Current Sets -->
      <div
        v-if="!showOldSets"
        v-for="set in sets"
        class="m-2 flex justify-between rounded-lg border-b-2 border-sonja-bg-darker pb-2 pr-6"
      >
        <button
          @click="
            () => {
              setIdToUpdate = set.id;
              showUpdateWorkoutExerciseDialog = true;
              newReps = set.reps;
              newWeight = set.weight;
            }
          "
          class="flex flex-col items-start"
        >
          <div>Reps: {{ set.reps }}</div>
          <div>
            {{ workoutExercise.metric }}: {{ set.weight
            }}{{ workoutExercise.metric === "Time" ? "s" : " kg" }}
          </div>
        </button>

        <!-- Delete Set -->
        <button
          @click="
            setToDelete = set.id;
            showConfirmDeleteSet = true;
          "
        >
          <i class="fa-solid fa-close" />
        </button>
      </div>
      <!-- Last Sets -->
      <div
        v-if="showOldSets"
        v-for="set in lastSets"
        class="m-2 flex justify-between rounded-lg border-b-2 bg-sonja-text p-2 pr-6 text-sonja-akz2"
      >
        <div class="flex flex-col">
          <div>Reps: {{ set.reps }}</div>
          <div>
            {{ workoutExercise.metric }}: {{ set.weight
            }}{{ workoutExercise.metric === "Weight" ? " kg" : "s" }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="sets?.length === 0 && !showOldSets">
      <div
        class="flex h-20 w-full cursor-pointer items-center justify-center rounded-t-3xl bg-sonja-bg-darker text-3xl font-bold"
        @click="() => (showUpdateWorkoutExerciseDialog = true)"
      >
        New Set
      </div>
    </div>
    <!-- Add Set -->
    <button
      v-if="!showOldSets"
      @click="showUpdateWorkoutExerciseDialog = true"
      class="-mt-2 flex w-full justify-center rounded-full rounded-t bg-sonja-bg-darker pt-1"
    >
      <i class="fa-solid fa-plus text-4xl"></i>
    </button>
    <!-- Delete Set Confirmation -->
    <Confirm
      v-model:isOpen="showConfirmDeleteSet"
      @yes="removeSet(Number(setToDelete))"
    />
    <!-- New Rep/Weigt -->
    <Dialog
      :isOpen="showUpdateWorkoutExerciseDialog"
      @close="
        {
          showUpdateWorkoutExerciseDialog = false;
          newReps = undefined;
          newWeight = undefined;
          setIdToUpdate = undefined;
        }
      "
    >
      <div class="flex flex-col items-center justify-center gap-4">
        {{ setIdToUpdate ? "Set: " + setIdToUpdate : "" }}
        <div class="mt-2 grid grid-cols-2 gap-2">
          <UiNumberInput v-model:modelValue="newReps" label="Reps" focus />
          <UiNumberInput
            v-model:modelValue="newWeight"
            :label="workoutExercise.metric"
          />
        </div>
        <Button @action="handleSet"> Done </Button>
      </div>
    </Dialog>
    <!-- Info -->
    <Dialog
      :isOpen="showInfo"
      @close="
        showInfo = false;
        exercise?.info ? (editInfo = false) : (editInfo = true);
      "
    >
      <div class="flex flex-col items-center justify-center gap-4">
        <TextareaInfo
          v-model:edit-info="editInfo"
          :info="exercise?.info"
          :exerciseId="props.exercise?.exercise_id"
        />
      </div>
    </Dialog>
  </div>
</template>
