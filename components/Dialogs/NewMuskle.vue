<template>
  <Textinput v-model="newMuscleName" label="Musklename" />
  <Button class="mt-4" @action="addMuscle"> Neuer Muskel! </Button>
</template>

<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";

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
