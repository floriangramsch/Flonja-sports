<template>
  <form>
    <div>
      {{ equip?.exercise_name }} [{{ equip.category_name }}]
      <input
        v-model="newWorkoutWeight"
        style="width: 64px"
        class="ml-1 rounded-md bg-sonja-akz2 p-1"
      />
    </div>
    <button
      @click.prevent="addNewExercice"
      class="mt-4 rounded bg-sonja-akz p-2"
    >
      Neues Gewicht!
    </button>
  </form>
</template>

<script setup lang="ts">
import useAddExercise from "~/composables/Exercises/useAddExercise";

const newWorkoutWeight = ref("");

const props = defineProps<{
  equip: EquipType;
  workout: WorkoutType;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mutation = useAddExercise();

const addNewExercice = () => {
  if (
    newWorkoutWeight.value &&
    props.workout.workout_id &&
    props.equip.exercise_id
  ) {
    mutation.mutate(
      {
        workout_id: props.workout.workout_id,
        exercise_id: props.equip.exercise_id,
        weight: newWorkoutWeight.value,
      },
      {
        onSuccess: () => emit("close"),
      },
    );
  }
};
</script>
