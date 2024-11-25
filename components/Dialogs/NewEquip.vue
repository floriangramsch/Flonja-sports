<template>
  <form>
    <div class="flex flex-col">
      <div>
        <label>Gerätename:</label>
        <input
          v-model="newEquipName"
          class="p-1 m-1 rounded-md ml-1 bg-sonja-akz2"
        />
      </div>
      <Select
        v-model="newEquipMuscleId"
        default="Muskle..."
        :options="muscles"
      />
    </div>

    <Button @click="addNewEquip">Neues Gerät!</Button>
  </form>
</template>

<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";
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
      }
    );
  }
};
</script>
