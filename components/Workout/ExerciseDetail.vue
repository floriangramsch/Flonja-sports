<script setup lang="ts">
import useDeleteExercise from "~/composables/Exercises/useDeleteExercise";
import { useGetSets } from "~/composables/useSets";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Confirm from "../Dialogs/Confirm.vue";

const props = defineProps<{
  exercise: any;
  workoutInfo: {
    start: Date;
    user_id: number;
  };
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mutation = useDeleteExercise();
const deleteSetMutation = useDeleteSet();
const { data: sets } = useGetSets(props.exercise.exercice_id);
const addSetMutation = useAddSet();
const { data: lastSets } = useGetLastSets({
  equip_id: props.exercise.equip_id,
  user_id: props.workoutInfo?.user_id,
  start: props.workoutInfo?.start,
});

const removeExercise = () => {
  mutation.mutate(props.exercise.exercice_id, {
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

const addSet = () => {
  if (newWeight.value && newReps.value) {
    addSetMutation.mutate(
      {
        exercise_id: props.exercise.exercice_id,
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
      }
    );
  }
};

const showUpdateExerciseDialog = ref<boolean>(false);
const showConfirmDeleteSet = ref<boolean>(false);
const showConfirmDeleteExercise = ref<boolean>(false);
const showOldSets = ref<boolean>(false);

const newWeight = ref<number>();
const newReps = ref<number>();
</script>

<template>
  <div class="absolute inset-0 pb-52">
    <!-- Header -->
    <div class="w-full flex justify-evenly py-4">
      <button
        class="flex items-center bg-sonja-bg-darker text-sonja-text h-10 px-4 rounded-full shadow"
        @click="emit('close')"
      >
        <i class="fa-solid fa-arrow-left" />
      </button>
      <div class="text-4xl font-bold text-center">
        {{ exercise.equipName }}
      </div>
      <Confirm
        v-model:isOpen="showConfirmDeleteExercise"
        @yes="removeExercise"
        class="flex items-center bg-sonja-bg-darker text-red-800 h-10 px-4 rounded-full shadow"
      >
        <i class="fa-solid fa-close" />
      </Confirm>
    </div>
    <!-- Switch between current and old sets -->
    <div class="flex w-full justify-center mb-5">
      <button
        class="text-3xl disabled"
        :class="lastSets?.length === 0 ? 'opacity-50' : ''"
        :disabled="lastSets?.length === 0"
        @click="showOldSets = !showOldSets"
      >
        <i class="fa-solid fa-repeat" />
      </button>
    </div>
    <!-- Sets -->
    <div>
      <!-- Current Sets -->
      <div
        v-if="!showOldSets"
        v-for="set in sets"
        class="flex justify-between m-2 pr-6 pb-2 border-b-2 border-sonja-bg-darker rounded-lg"
      >
        <div class="flex flex-col">
          <div>Reps: {{ set.reps }}</div>
          <div>Gewicht: {{ set.weight }}</div>
        </div>

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
        class="flex justify-between m-2 pr-6 pb-2 border-b-2 bg-sonja-akz rounded-lg"
      >
        <div class="flex flex-col">
          <div>Reps: {{ set.reps }}</div>
          <div>Gewicht: {{ set.weight }}</div>
        </div>
      </div>
    </div>
    <div v-if="sets?.length === 0 && !showOldSets">
      <div
        class="bg-sonja-bg-darker rounded-t-3xl w-full h-20 flex justify-center items-center text-3xl font-bold cursor-pointer"
        @click="() => (showUpdateExerciseDialog = true)"
      >
        New Set
      </div>
    </div>
    <!-- Add Set -->
    <button
      v-if="!showOldSets"
      @click="showUpdateExerciseDialog = true"
      class="flex w-full justify-center bg-sonja-bg-darker rounded-t rounded-full pt-1 -mt-2"
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
      @close="showUpdateExerciseDialog = false"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="grid grid-cols-2 gap-2">
          Reps:
          <UiNumberInput v-model:modelValue="newReps" focus />
          Weight:
          <UiNumberInput v-model:modelValue="newWeight" />
        </div>
        <Button @action="addSet"> Done </Button>
      </div>
    </Dialog>
  </div>
</template>
