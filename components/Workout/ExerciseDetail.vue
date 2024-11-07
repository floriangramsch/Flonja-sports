<script setup lang="ts">
import useDeleteExercise from "~/composables/Exercises/useDeleteExercise";
import { useGetSets } from "~/composables/useSets";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";
import SlideTransition from "../ui/transitions/SlideTransition.vue";

const props = defineProps<{
  exercise: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mutation = useDeleteExercise();
const { data: sets } = useGetSets(props.exercise.exercice_id);
const addSetMutation = useAddSet();

const removeExercise = () => {
  mutation.mutate(props.exercise.exercice_id, {
    onSuccess: () => emit("close"),
  });
};

const addSet = () => {
  if (newWeight.value && newReps.value) {
    showDialog.value = false;
    addSetMutation.mutate({
      exercise_id: props.exercise.exercice_id,
      weight: newWeight.value,
      reps: newReps.value,
    });
  }
};

const showDialog = ref<boolean>(false);
const newWeight = ref<number>();
const newReps = ref<number>();

const inputRef = ref<HTMLInputElement | null>(null);

watch(
  () => inputRef.value,
  (newVal) => {
    if (newVal) {
      newVal.focus();
    }
  }
);
</script>

<template>
  <div class="absolute inset-0">
    <div>Name: {{ exercise.equipName }}</div>
    <div v-for="set in sets" class="flex flex-col m-2">
      <div>Gewicht: {{ set.weight }}</div>
      <div>Reps: {{ set.reps }}</div>
    </div>
    <button @click="showDialog = true" class="flex w-full justify-center">
      <i class="fa-solid fa-plus text-4xl"></i>
    </button>
    <div class="w-full flex justify-center">
      <button
        class="bg-sonja-akz mt-10 text-white h-8 px-10 rounded-3xl shadow"
        @click="emit('close')"
      >
        Close
      </button>
      <button
        class="bg-sonja-akz mt-10 text-white h-8 px-10 rounded-3xl shadow"
        @click="removeExercise"
      >
        Remove
      </button>
    </div>
    <Dialog :isOpen="showDialog" @close="showDialog = false">
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            Weight:
            <input
              v-model="newWeight"
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              class="w-10 remove-arrow"
              ref="inputRef"
            />
          </div>
          <div class="flex gap-2">
            Reps:
            <input
              v-model="newReps"
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              class="w-10 remove-arrow"
            />
          </div>
        </div>
        <Button @action="addSet"> Done </Button>
      </div>
    </Dialog>
  </div>
</template>

<style>
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.remove-arrow {
  appearance: none;
  -moz-appearance: textfield;
}
</style>
