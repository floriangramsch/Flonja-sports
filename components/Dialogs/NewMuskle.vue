<template>
  <form>
    <div>
      <label>Musklename:</label>
      <input
        v-model="newMuscleName"
        class="p-1 rounded-md ml-1 bg-sonja-akz2"
      />
    </div>
    <button
      @click.prevent="addMuscle"
      class="mt-4 bg-sonja-akz text-sonja-akz2 p-2 rounded"
    >
      Neuer Muskle!
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const newMuscleName = ref("");

const emit = defineEmits<{
  (e: "close"): void;
}>();

const addMuscleMutation = useAddMuscle();

const addMuscle = () => {
  if (newMuscleName.value) {
    addMuscleMutation.mutate(newMuscleName.value, {
      onSuccess: () => emit("close"),
    });
  }
};
</script>
