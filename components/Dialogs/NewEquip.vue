<template>
  <div class="mb-2 flex flex-col gap-2">
    <Textinput v-model="newEquipName" label="Gerätename" />
    <Select
      v-if="categories"
      v-model="newEquipCategoryId"
      default="Category..."
      :options="
        categories.map((category) => ({
          label: category.category_name,
          value: category.category_id,
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

  <Button @click="addNewEquip">Neue Gerät!</Button>
</template>

<script setup lang="ts">
import type { EquipMetricType, EquipArtType } from "~/utils/types";
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import Select from "../ui/select/Select.vue";

const props = defineProps<{
  category_id?: number;
}>();

const newEquipName = ref("");
const newType = ref<EquipArtType>();
const newMetric = ref<EquipMetricType>();
const newEquipCategoryId = ref<number | undefined>(props.category_id ?? undefined);

const { data: categories } = useCategories();
const mutation = useAddExercise();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const addNewEquip = () => {
  if (
    newEquipName.value &&
    newEquipCategoryId.value &&
    newType.value &&
    newMetric.value
  ) {
    mutation.mutate(
      {
        name: newEquipName.value,
        type: newType.value,
        metric: newMetric.value,
        category_id: newEquipCategoryId.value,
      },
      {
        onSuccess: () => emit("close"),
      },
    );
  }
};
</script>
