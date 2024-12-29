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
  (e: "startTimer"): void;
  (e: "next"): void;
  (e: "prev"): void;
}>();

const mutation = useDeleteWorkoutExercise();
const deleteSetMutation = useDeleteSet();
const { data: sets } = useGetSetsByExerciseId(
  computed(() => props.workoutExercise.workout_exercise_id),
);
const addSetMutation = useAddSet();
const updateSetMutaiton = useUpdateSet();
const { data: lastSets } = useGetLastSets(
  computed(() => ({
    exercise_id: props.workoutExercise.exercise_id,
    user_id: props.workoutInfo?.user_id,
    start: props.workoutInfo?.start,
  })),
);

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
const newReps = ref<number | undefined>(
  props.workoutExercise.metric === "Time" ? 1 : undefined,
);
const setIdToUpdate = ref<number>();

watch(
  () => sets.value,
  (newVal) => {
    if (newVal) {
      showOldSets.value =
        newVal.length === 0 && lastSets.value && lastSets.value?.length !== 0;
    }
  },
);
</script>

<template>
  <div class="absolute inset-0 pb-52">
    <!-- {{ exercise }} -->
    <!-- {{ workoutExercise }} -->
    <Header
      @left="emit('close')"
      leftIcon="fa-solid fa-arrow-left"
    >
      {{ workoutExercise.exercise_name }}
      <template #right-pure>
        <Confirm
          v-model:isOpen="showConfirmDeleteWorkoutExercise"
          @yes="removeWorkoutExercise"
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-red-800 shadow"
        >
          <i class="fa-solid fa-close" />
        </Confirm>
      </template>
    </Header>
    <!-- Buttons -->
    <div class="mb-5 flex w-full items-center justify-center gap-3">
      <!-- Switch between current and old sets -->
      <i class="fa-solid fa-arrow-left text-3xl" @click="emit('prev')" />
      <button
        class="text-3xl"
        :class="lastSets?.length === 0 ? 'opacity-50' : ''"
        :disabled="lastSets?.length === 0"
        @click="showOldSets = !showOldSets"
      >
        <i class="fa-solid fa-repeat" />
      </button>
      <i class="fa-solid fa-arrow-right text-3xl" @click="emit('next')" />
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
          <div v-if="workoutExercise.metric !== 'Time'">
            Reps: {{ set.reps }}
          </div>
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
          <div v-if="workoutExercise.metric !== 'Time'">
            Reps: {{ set.reps }}
          </div>
          <div>
            {{ workoutExercise.metric }}: {{ set.weight }}
            {{ workoutExercise.metric === "Weight" ? " kg" : "s" }}
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
        <div
          class="mt-2 grid grid-cols-2 gap-2"
          :class="{
            'grid-cols-2': workoutExercise.metric === 'Weight',
            'grid-cols-1': workoutExercise.metric === 'Time',
          }"
        >
          <UiNumberInput
            v-if="workoutExercise.metric !== 'Time'"
            v-model:modelValue="newReps"
            label="Reps"
            :focus="workoutExercise.metric === 'Weight'"
          />
          <UiNumberInput
            v-model:modelValue="newWeight"
            :label="workoutExercise.metric"
            :focus="workoutExercise.metric === 'Time'"
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
