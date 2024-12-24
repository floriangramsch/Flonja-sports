<template>
  <div class="p-1" @click.prevent="showDialogWeight = workout ? true : false">
    <div class="font-bold">
      {{ exercise.exercise_name }} [{{ exercise.category_name }}]
    </div>
    <div></div>
  </div>
  <Dialog
    v-if="workout"
    :isOpen="showDialogWeight"
    @close="showDialogWeight = false"
  >
    <NewWorkoutExercise
      :exercise="exercise"
      :workout="workout"
      @close="showDialogWeight = false"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "../Dialogs/Dialog.vue";
import NewWorkoutExercise from "../Dialogs/NewWorkoutExercise.vue";

const showDialogWeight = ref(false);

defineProps<{
  exercise: ExerciseType;
  users: UserType;
  workout: WorkoutType | undefined;
}>();
</script>
