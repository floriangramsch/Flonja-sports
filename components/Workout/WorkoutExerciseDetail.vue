<script setup lang="ts">
import { useGetSetsByExerciseId } from "~/composables/useSets";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Confirm from "../Dialogs/Confirm.vue";
import TextareaInfo from "../ui/inputs/TextareaInfo.vue";

const props = defineProps<{
  workoutInfo: {
    start: Date;
    user_id: number;
    rest_time: number;
  };
  exercise: ExerciseType | undefined;
}>();

const wexToShow = useExToShowStore();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "next"): void;
  (e: "prev"): void;
}>();

const mutation = useDeleteWorkoutExercise();
const deleteSetMutation = useDeleteSet();
const { data: sets } = useGetSetsByExerciseId(
  computed(() => wexToShow.wex?.workout_exercise_id ?? 0),
);
const addSetMutation = useAddSet();
const updateSetMutaiton = useUpdateSet();
const { data: lastSets } = useGetLastSets(
  computed(() => ({
    exercise_id: wexToShow.wex?.exercise_id ?? 0,
    user_id: props.workoutInfo?.user_id,
    start: props.workoutInfo?.start,
  })),
);

const removeWorkoutExercise = () => {
  if (wexToShow.wex?.workout_exercise_id) {
    mutation.mutate(wexToShow.wex.workout_exercise_id, {
      onSuccess: () => {
        showConfirmDeleteWorkoutExercise.value = false;
        emit("close");
      },
    });
  }
};

const setToDelete = ref<number>();
const removeSet = (id: number) => {
  deleteSetMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteSet.value = false),
  });
};

const handleSet = () => {
  if (
    newWeight.value !== undefined &&
    (newReps.value !== undefined || wexToShow.wex?.metric === "Time")
  ) {
    let totalSeconds;
    if (typeof newWeight.value === "string") {
      const [minutes, seconds] = newWeight.value.toString().split(":");
      const minutesConverted = Number(minutes);
      const secondsConverted = Number(seconds);
      totalSeconds = 60 * minutesConverted + secondsConverted;
    }
    const resultSeconds =
      totalSeconds !== undefined ? totalSeconds : newWeight.value;
    if (setIdToUpdate.value) {
      updateSetMutaiton.mutate(
        {
          set_id: setIdToUpdate.value,
          weight: Number(resultSeconds),
          reps: newReps.value ?? 1,
        },
        {
          onSuccess: () => {
            showOldSets.value = false;
            showUpdateWorkoutExerciseDialog.value = false;
            newReps.value = wexToShow.wex?.metric === "Time" ? 1 : undefined;
            setIdToUpdate.value = undefined;
          },
        },
      );
    } else {
      if (wexToShow.wex?.workout_exercise_id) {
        addSetMutation.mutate(
          {
            workout_exercise_id: wexToShow.wex?.workout_exercise_id,
            weight: Number(resultSeconds),
            reps: newReps.value ?? 1,
          },
          {
            onSuccess: () => {
              showOldSets.value = false;
              showUpdateWorkoutExerciseDialog.value = false;
              newReps.value = wexToShow.wex?.metric === "Time" ? 1 : undefined;
              setIdToUpdate.value = undefined;
            },
          },
        );
      }
    }
  }
};

const showUpdateWorkoutExerciseDialog = ref<boolean>(false);
const showConfirmDeleteSet = ref<boolean>(false);
const showConfirmDeleteWorkoutExercise = ref<boolean>(false);
const showOldSets = ref<boolean>(false);
const showInfo = ref<boolean>(false);
const editInfo = ref<boolean>(!props.exercise?.info);

const newWeight = ref<number | string>();
const newReps = ref<number | undefined>(
  wexToShow.wex?.metric === "Time" ? 1 : undefined,
);
const setIdToUpdate = ref<number>();

const convertToTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

watch(
  () => sets.value,
  (newVal) => {
    if (newVal) {
      showOldSets.value =
        newVal.length === 0 && lastSets.value && lastSets.value?.length !== 0;
    }
  },
);

watch(
  () => wexToShow.wex,
  (newVal) => {
    if (newVal) {
      newReps.value = newVal.metric === "Time" ? 1 : undefined;
      newWeight.value = undefined;
      setIdToUpdate.value = undefined;
    }
  },
);
</script>

<template>
  <div class="absolute inset-0 pb-52">
    <Header @left="emit('close')" leftIcon="fa-solid fa-arrow-left">
      {{ wexToShow.wex?.exercise_name }}
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
          <div
            v-if="wexToShow.wex?.metric !== 'Time'"
            class="flex items-center gap-2"
          >
            Reps
            <i class="fa-solid fa-arrow-right" />
            {{ set.reps }}
          </div>
          <div class="flex items-center gap-2">
            {{ wexToShow.wex?.metric }}
            <i class="fa-solid fa-arrow-right" />
            {{
              wexToShow.wex?.metric === "Time"
                ? convertToTime(set.weight)
                : set.weight
            }}
            {{ wexToShow.wex?.metric === "Time" ? "min" : " kg" }}
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
          <div
            v-if="wexToShow.wex?.metric !== 'Time'"
            class="flex items-center gap-2"
          >
            Reps
            <i class="fa-solid fa-arrow-right" />
            {{ set.reps }}
          </div>
          <div class="flex items-center gap-2">
            {{ wexToShow.wex?.metric }}
            <i class="fa-solid fa-arrow-right" />
            {{
              wexToShow.wex?.metric === "Time"
                ? convertToTime(set.weight)
                : set.weight
            }}
            {{ wexToShow.wex?.metric === "Time" ? "min" : " kg" }}
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
          newReps = wexToShow.wex?.metric === 'Time' ? 1 : undefined;
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
            'grid-cols-2': wexToShow.wex?.metric === 'Weight',
            'grid-cols-1': wexToShow.wex?.metric === 'Time',
          }"
        >
          <UiNumberInput
            v-if="wexToShow.wex?.metric !== 'Time'"
            v-model:modelValue="newReps"
            label="Reps"
            :focus="wexToShow.wex?.metric === 'Weight'"
          />

          <UiNumberInput
            v-if="wexToShow.wex?.metric !== 'Time'"
            v-model:modelValue="newWeight"
            label="Weight"
          />
          <UiTimeInput
            v-else
            v-model:modelValue="newWeight"
            :label="wexToShow.wex?.metric"
            :focus="wexToShow.wex?.metric === 'Time'"
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
