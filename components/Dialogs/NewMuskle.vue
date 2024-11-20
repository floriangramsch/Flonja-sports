<template>
  <form>
    <div>
      <label>Musklename:</label>
      <input
        v-model="newMuscleName"
        class="p-1 rounded-md ml-1 bg-sonja-akz2"
      />
    </div>
    <Button class="mt-4" @action="addMuscle"> Neuer Muskel! </Button>
  </form>
</template>

<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";

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
