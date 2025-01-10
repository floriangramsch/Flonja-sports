<template>
  <div class="mb-2 flex flex-col gap-2">
    <Textinput v-model="newExerciseName" label="Name..." />
    <Select
      v-if="categories"
      v-model="newExerciseCategoryId"
      default="Category..."
      :options="
        categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      "
    />
    <Select
      class="w-full"
      v-model="newType"
      default="Type..."
      defaultSelected="Bodyweight"
      :options="[
        { value: 'Bodyweight', label: 'Bodyweight' },
        { value: 'Machine', label: 'Machine' },
        { value: 'Dumbbell', label: 'Dumbbell' },
      ]"
    />

    <Select
      class="w-full"
      v-model="newMetric"
      default="Metric..."
      defaultSelected="Weight"
      :options="[
        { value: 'Time', label: 'Time' },
        { value: 'Weight', label: 'Weight' },
      ]"
    />
  </div>

  <Button @click="addNewExercise">New Exercise!</Button>
</template>

<script setup lang="ts">
import type { ExerciseMetricType, ExerciseArtType } from "~/utils/types";
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import Select from "../ui/select/Select.vue";

const props = defineProps<{
  category_id?: number;
}>();

const newExerciseName = ref("");
const newType = ref<ExerciseArtType>();
const newMetric = ref<ExerciseMetricType>();
const newExerciseCategoryId = ref<number | undefined>(props.category_id ?? undefined);

const { data: categories } = useCategories();
const mutation = useAddExercise();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const addNewExercise = () => {
  if (
    newExerciseName.value &&
    newExerciseCategoryId.value &&
    newType.value &&
    newMetric.value
  ) {
    mutation.mutate(
      {
        name: newExerciseName.value,
        type: newType.value,
        metric: newMetric.value,
        category_id: newExerciseCategoryId.value,
      },
      {
        onSuccess: () => emit("close"),
      },
    );
  }
};
</script>
