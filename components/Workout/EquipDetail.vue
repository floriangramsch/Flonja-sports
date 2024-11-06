<script setup lang="ts">
import useDeleteExercise from "~/composables/Exercises/useDeleteExercise";

const props = defineProps<{
  exercise: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mutation = useDeleteExercise();

const removeExercise = () => {
  mutation.mutate(props.exercise.exercice_id, {
    onSuccess: () => emit("close"),
  });
};
</script>

<template>
  <div class="absolute inset-0">
    <div class="flex flex-col">
      <div>Name: {{ exercise.name }}</div>
      <div>Gewicht: {{ exercise.weight }}</div>
      <div>
        Sets:
        {{ exercise.sets }}
      </div>
      <div>Reps: {{ exercise.reps }}</div>
    </div>
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
  </div>
</template>
