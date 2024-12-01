<template>
  <div class="mb-2 flex flex-col gap-2">
    <Textinput v-model="newEquipName" label="Gerätename" />
    <Select v-model="newEquipMuscleId" default="Muskle..." :options="muscles" />
  </div>

  <Button @click="addNewEquip">Neues Gerät!</Button>
</template>

<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import Select from "../ui/select/Select.vue";

const props = defineProps<{
  muscleId?: number;
}>();

const newEquipName = ref("");
const newEquipMuscleId = ref<number | undefined>(props.muscleId ?? undefined);

const { data: muscles } = useMuscles();
const mutation = useAddEquips();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const addNewEquip = () => {
  if (newEquipName.value && newEquipMuscleId.value) {
    mutation.mutate(
      {
        name: newEquipName.value,
        muscleGroupId: newEquipMuscleId.value,
      },
      {
        onSuccess: () => emit("close"),
      },
    );
  }
};
</script>
