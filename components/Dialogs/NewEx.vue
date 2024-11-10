<template>
  <form>
    <div>
      {{ equip?.equip_name }} [{{ equip.muscle_name }}]
      <input
        v-model="newWorkoutWeight"
        style="width: 64px"
        class="p-1 bg-sonja-akz2 rounded-md ml-1"
      />
    </div>
    <button
      @click.prevent="addNewExercice"
      class="mt-4 bg-sonja-akz p-2 rounded"
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
    props.equip.equip_id
  ) {
    mutation.mutate(
      {
        workout_id: props.workout.workout_id,
        equip_id: props.equip.equip_id,
        weight: newWorkoutWeight.value,
      },
      {
        onSuccess: () => emit("close"),
      }
    );
  }
};
</script>
