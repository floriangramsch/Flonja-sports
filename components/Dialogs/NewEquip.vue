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
      <select
        v-model="newEquipMuscleId"
        class="p-1 m-1 rounded-md bg-sonja-akz"
      >
        <option value="undefined" disabled selected>Muskle..</option>
        <option
          v-for="muscle in muscles"
          :key="muscle.muscle_group_id"
          :value="muscle.muscle_group_id"
          class="py-1"
        >
          {{ muscle.muscle_name }}
        </option>
      </select>
    </div>

    <Button @click="addNewEquip">Neues Gerät!</Button>
  </form>
</template>

<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";

const newEquipName = ref("");
const newEquipMuscleId = ref<number | undefined>(undefined);

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
