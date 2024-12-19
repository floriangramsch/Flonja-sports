<script setup lang="ts">
import useDeleteExercise from "~/composables/Exercises/useDeleteExercise";
import { useGetSetsByExerciseId } from "~/composables/useSets";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Confirm from "../Dialogs/Confirm.vue";
import TextareaInfo from "../ui/inputs/TextareaInfo.vue";

const props = defineProps<{
  exercise: WorkoutExerciseType;
  workoutInfo: {
    start: Date;
    user_id: number;
    rest_time: number;
  };
  equip: EquipType | undefined;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (emits: "startTimer"): void;
}>();

const mutation = useDeleteExercise();
const deleteSetMutation = useDeleteSet();
const { data: sets } = useGetSetsByExerciseId(props.exercise.workout_exercise_id);
const addSetMutation = useAddSet();
const updateSetMutaiton = useUpdateSet();
const { data: lastSets } = useGetLastSets({
  exercise_id: props.exercise.exercise_id,
  user_id: props.workoutInfo?.user_id,
  start: props.workoutInfo?.start,
});

const removeExercise = () => {
  mutation.mutate(props.exercise.workout_exercise_id, {
    onSuccess: () => {
      showConfirmDeleteExercise.value = false;
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
            showUpdateExerciseDialog.value = false;
            // newWeight.value = undefined;
            newReps.value = undefined;
          },
        },
      );
    } else {
      addSetMutation.mutate(
        {
          workout_exercise_id: props.exercise.workout_exercise_id,
          weight: newWeight.value,
          reps: newReps.value,
        },
        {
          onSuccess: () => {
            showOldSets.value = false;
            showUpdateExerciseDialog.value = false;
            newReps.value = undefined;
            emit("startTimer");
          },
        },
      );
    }
  }
};

const showUpdateExerciseDialog = ref<boolean>(false);
const showConfirmDeleteSet = ref<boolean>(false);
const showConfirmDeleteExercise = ref<boolean>(false);
const showOldSets = ref<boolean>(false);
const showInfo = ref<boolean>(false);
const editInfo = ref<boolean>(!props.equip?.info);

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
        {{ exercise.exercise_name }}
      </div>
      <Confirm
        v-model:isOpen="showConfirmDeleteExercise"
        @yes="removeExercise"
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
              showUpdateExerciseDialog = true;
              newReps = set.reps;
              newWeight = set.weight;
            }
          "
          class="flex flex-col items-start"
        >
          <div>Reps: {{ set.reps }}</div>
          <div>
            {{ exercise.metric }}: {{ set.weight
            }}{{ exercise.metric === "Time" ? "s" : " kg" }}
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
            {{ exercise.metric }}: {{ set.weight
            }}{{ exercise.metric === "Weight" ? " kg" : "s" }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="sets?.length === 0 && !showOldSets">
      <div
        class="flex h-20 w-full cursor-pointer items-center justify-center rounded-t-3xl bg-sonja-bg-darker text-3xl font-bold"
        @click="() => (showUpdateExerciseDialog = true)"
      >
        New Set
      </div>
    </div>
    <!-- Add Set -->
    <button
      v-if="!showOldSets"
      @click="showUpdateExerciseDialog = true"
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
      :isOpen="showUpdateExerciseDialog"
      @close="
        {
          showUpdateExerciseDialog = false;
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
            :label="exercise.metric"
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
        equip?.info ? (editInfo = false) : (editInfo = true);
      "
    >
      <div class="flex flex-col items-center justify-center gap-4">
        <TextareaInfo
          v-model:edit-info="editInfo"
          :info="equip?.info"
          :equip-id="props.equip?.exercise_id"
        />
      </div>
    </Dialog>
  </div>
</template>
