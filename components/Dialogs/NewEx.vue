<template>
  <form>
    <div>
      {{ equip?.equip_name }} [{{ equip.equip_muscle_name }}]
      <input
        v-model="newWorkoutWeight"
        style="width: 64px"
        class="p-1 bg-sonja-akz2 rounded-md ml-1"
      />
    </div>
    <button
      @click.prevent="addNewExercice"
      class="mt-4 bg-sonja-akz p-2 rounded"
    >
      Neues Gewicht!
    </button>
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const newWorkoutWeight = ref("");

const props = defineProps<{
  equip: EquipSpecialType;
  workout: LoggedWorkout;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mutation = useMutation({
  mutationFn: async (newEx: {
    workout_id: number;
    equip_id: number;
    weight: string;
  }) => {
    const response = await fetch("/api/addExercise", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEx),
    });
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["workouts"] });
    queryClient.invalidateQueries({ queryKey: ["equips"] });
    emit("close");
  },
});

const addNewExercice = () => {
  if (newWorkoutWeight.value && props.workout.id && props.equip.id) {
    mutation.mutate({
      workout_id: props.workout.id,
      equip_id: props.equip.id,
      weight: newWorkoutWeight.value,
    });
  }
};
</script>
