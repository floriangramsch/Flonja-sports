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
    <button @click.prevent="addNewEquip" class="mt-4 bg-sonja-akz p-2 rounded">
      Neues Gerät!
    </button>
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const newEquipName = ref("");
const newEquipMuscleId = ref<number | undefined>(undefined);

defineProps<{
  muscles: MuscleType;
}>();

const equips = defineModel<EquipType>("equips");

const emit = defineEmits<{
  (e: "close"): void;
}>();

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: async (newEquip: { name: string; muscleGroupId: number }) => {
    const response = await fetch("/api/addEquip", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEquip),
    });
    return response.json();
  },
  onSuccess: (data) => {
    // const newEquip = {
    //   id: Number(data.id),
    //   FloLast: null,
    //   FloPB: null,
    //   SonjaLast: null,
    //   SonjaPB: null,
    //   equip_muscle_name:
    //     props.muscles[Number(newEquipMuscleId.value)].muscle_name,
    //   equip_name: newEquipName.value,
    //   exercises: {},
    // };
    // if (equips.value) {
    //   equips.value[Number(data.id)] = newEquip;
    // }
    queryClient.invalidateQueries({ queryKey: ["equips"] });
    emit("close");
  },
});

const addNewEquip = () => {
  if (newEquipName.value && newEquipMuscleId.value) {
    mutation.mutate({
      name: newEquipName.value,
      muscleGroupId: newEquipMuscleId.value,
    });
  }
};
</script>
