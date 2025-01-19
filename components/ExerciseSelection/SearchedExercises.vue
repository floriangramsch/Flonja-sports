<script setup lang="ts">
defineProps<{
  exercises: ExerciseType[];
}>();

defineEmits<{
  (e: "action"): void;
}>();

const result = defineModel();
</script>

<template>
  <div
    v-for="ex in exercises"
    class="flex cursor-pointer justify-center border-b-4 border-sonja-bg-darker py-2"
    @click="
      $emit('action');
      result = ex.exercise_id;
    "
  >
    {{ ex.exercise_name }}
  </div>
</template>
