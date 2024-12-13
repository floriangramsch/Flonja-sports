<template>
  <div class="mb-2 flex flex-col gap-2">
    <Textinput v-model="newEquipName" label="Gerätename" />
    <Select
      v-if="muscles"
      v-model="newEquipMuscleId"
      default="Muskle..."
      :options="
        muscles.map((muscle) => ({
          label: muscle.muscle_name,
          value: muscle.muscle_group_id,
        }))
      "
    />
    <Select
      class="w-full"
      v-model="newType"
      default="Type..."
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
      :options="[
        { value: 'Time', label: 'Time' },
        { value: 'Weight', label: 'Weight' },
      ]"
    />
  </div>

  <Button @click="addNewEquip">Neues Gerät!</Button>
</template>

<script setup lang="ts">
import type { EquipMetricType, EquipArtType } from "~/utils/types";
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import Select from "../ui/select/Select.vue";

const props = defineProps<{
  muscleId?: number;
}>();

const newEquipName = ref("");
const newType = ref<EquipArtType>();
const newMetric = ref<EquipMetricType>();
const newEquipMuscleId = ref<number | undefined>(props.muscleId ?? undefined);

const { data: muscles } = useMuscles();
const mutation = useAddEquips();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const addNewEquip = () => {
  if (
    newEquipName.value &&
    newEquipMuscleId.value &&
    newType.value &&
    newMetric.value
  ) {
    mutation.mutate(
      {
        name: newEquipName.value,
        type: newType.value,
        metric: newMetric.value,
        muscleGroupId: newEquipMuscleId.value,
      },
      {
        onSuccess: () => emit("close"),
      },
    );
  }
};
</script>
