<script setup lang="ts">
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import MultiSelect from "../ui/select/MultiSelect.vue";
import Select from "../ui/select/Select.vue";

defineProps<{
  categories: CategoryType[];
}>();

const exerciseForm = ref();

const isOpen = ref<boolean>(false);
const open = () => (isOpen.value = true);
const close = () => (isOpen.value = false);
const setForm = (form: {
  exercise_name?: string;
  exercise_id?: number;
  categories: number[];
  info?: string;
  type?: ExerciseArtType;
  metric?: ExerciseMetricType;
}) => (exerciseForm.value = form);

defineExpose({
  open,
  close,
  setForm,
});

const updateExerciseMutation = useUpdateExercise();
const updateExercise = () => {
  if (
    exerciseForm.value &&
    exerciseForm.value.exercise_id &&
    exerciseForm.value.categories
  ) {
    updateExerciseMutation.mutate(
      {
        updatedData: `name = '${exerciseForm.value.exercise_name}', info = '${exerciseForm.value.info}', type = '${exerciseForm.value.type}', metric = '${exerciseForm.value.metric}'`,
        exercise_id: exerciseForm.value.exercise_id,
        categorieIds: exerciseForm.value.categories,
      },
      {
        onSuccess: () => {
          close();
          exerciseForm.value = {
            exercise_name: undefined,
            exercise_id: undefined,
            categories: [],
            info: undefined,
            type: undefined,
            metric: undefined,
          };
        },
      },
    );
  }
};
</script>

<template>
  <Dialog
    :isOpen
    @close="
      // showDialogExercise = false;
      // showDialogCategory = false;
      close()
    "
  >
    <div class="my-2 flex flex-col gap-4">
      <Textinput
        v-model="exerciseForm.exercise_name"
        label="Exercise Name"
        focus
      />

      <MultiSelect
        v-model="exerciseForm.categories"
        name="Category"
        :options="
          categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))
        "
      />

      <div class="flex gap-2">
        <Select
          v-model="exerciseForm.type"
          default="Type..."
          :options="[
            { value: 'Bodyweight', label: 'Bodyweight' },
            { value: 'Machine', label: 'Machine' },
            { value: 'Dumbbell', label: 'Dumbbell' },
          ]"
        />

        <Select
          v-model="exerciseForm.metric"
          default="Metric..."
          :options="[
            { value: 'Time', label: 'Time' },
            { value: 'Weight', label: 'Weight' },
          ]"
        />
      </div>

      <!-- Info -->
      <div class="relative">
        <textarea
          class="peer h-48 w-48 rounded border-2 border-sonja-text bg-sonja-text p-2 text-sonja-akz2 shadow focus:outline-none focus:ring-2 focus:ring-sonja-akz"
          v-model="exerciseForm.info"
          ref="infoRef"
          placeholder=" "
        />
        <label
          :for="`input-${Math.random().toString(36).slice(2, 9)}`"
          class="absolute left-2 -translate-y-1/2 rounded bg-sonja-akz p-[2px] text-xs text-sonja-text shadow transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-xl peer-placeholder-shown:text-sonja-akz2 peer-focus:left-2 peer-focus:top-0 peer-focus:bg-sonja-akz peer-focus:p-[2px] peer-focus:text-xs peer-focus:text-sonja-text"
        >
          Info
        </label>
      </div>
    </div>
    <Button @action="updateExercise">Update</Button>
  </Dialog>
</template>
