<script setup lang="ts">
import useDeleteExercise from "~/composables/Exercises/useDeleteExercise";
import { useGetSets } from "~/composables/useSets";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Confirm from "../Dialogs/Confirm.vue";

const props = defineProps<{
  exercise: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mutation = useDeleteExercise();
const deleteSetMutation = useDeleteSet();
const { data: sets } = useGetSets(props.exercise.exercice_id);
const addSetMutation = useAddSet();

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
    showUpdateExerciseDialog.value = false;
    addSetMutation.mutate({
      exercise_id: props.exercise.exercice_id,
      weight: newWeight.value,
      reps: newReps.value,
    });
    newWeight.value = undefined;
    newReps.value = undefined;
  }
};

const showUpdateExerciseDialog = ref<boolean>(false);
const showConfirmDeleteSet = ref<boolean>(false);
const showConfirmDeleteExercise = ref<boolean>(false);

const newWeight = ref<number>();
const newReps = ref<number>();
</script>

<template>
  <div class="absolute inset-0">
    <div>Name: {{ exercise.equipName }}</div>
    <div
      v-for="set in sets"
      class="flex justify-between m-2 pr-6 pb-2 border-b-2 border-sonja-bg-darker rounded-lg"
    >
      <div class="flex flex-col">
        <div>Gewicht: {{ set.weight }}</div>
        <div>Reps: {{ set.reps }}</div>
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
    <Confirm
      v-model:isOpen="showConfirmDeleteSet"
      @yes="removeSet(Number(setToDelete))"
    />
    <button
      @click="showUpdateExerciseDialog = true"
      class="flex w-full justify-center bg-sonja-bg-darker rounded-t rounded-full pt-1 -mt-2"
    >
      <i class="fa-solid fa-plus text-4xl"></i>
    </button>
    <div class="w-full flex justify-center gap-2">
      <button
        class="bg-sonja-akz mt-10 text-white h-8 px-10 rounded-3xl shadow"
        @click="emit('close')"
      >
        Close
      </button>

      <Confirm
        v-model:isOpen="showConfirmDeleteExercise"
        @yes="removeExercise"
        class="bg-sonja-akz mt-10 text-white h-8 px-10 rounded-3xl shadow"
      >
        Remove
      </Confirm>
    </div>
    <Dialog
      :isOpen="showUpdateExerciseDialog"
      @close="showUpdateExerciseDialog = false"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="grid grid-cols-2 gap-2">
          Weight:
          <UiNumberInput v-model:modelValue="newWeight" focus />
          Reps:
          <UiNumberInput v-model:modelValue="newReps" />
        </div>
        <Button @action="addSet"> Done </Button>
      </div>
    </Dialog>
  </div>
</template>
