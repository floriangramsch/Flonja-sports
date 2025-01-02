<script setup lang="ts">
import Dialog from "../Dialogs/Dialog.vue";
import NumberInput from "../ui/number-input/NumberInput.vue";

const isOpen = ref<boolean>(false);
const open = () => (isOpen.value = true);
const close = () => (isOpen.value = false);

const newForm = ref();

const setForm = (form: {
  plan_id: number;
  name: string;
  sets: number;
  reps: number;
  reps_to: number;
}) => {
  isOpen.value = true;
  newForm.value = form;
};

const updateMutation = useUpdatePlanExercise();
const update = () => {
  if (newForm.value) {
    updateMutation.mutate(newForm.value, { onSuccess: () => close() });
  }
};

defineExpose({
  open,
  close,
  setForm,
});
</script>

<template>
  <Dialog :isOpen @close="close">
    <div class="mb-2 text-3xl font-bold">
      {{ newForm.name }}
    </div>
    <NumberInput v-model="newForm.sets" label="Sets" focus />
    <div class="flex items-center gap-1">
      <UiNumberInput v-model:modelValue="newForm.reps" label="from" />
      <UiNumberInput v-model:modelValue="newForm.reps_to" label="to" />
    </div>
    <UiButtonsButton @action="update" class="mt-2">Update</UiButtonsButton>
  </Dialog>
</template>
