<template>
  <form>
    <div>
      <label>Musklename:</label>
      <input
        v-model="newMuscleName"
        class="p-1 rounded-md ml-1 bg-sonja-akz2"
      />
    </div>
    <button
      @click.prevent="addMuscle"
      class="mt-4 bg-sonja-akz text-sonja-akz2 p-2 rounded"
    >
      Neuer Muskle!
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { useMutation } from "@tanstack/vue-query";

const newMuscleName = ref("");

const muscles = defineModel<MuscleType>("muscles");

const emit = defineEmits<{
  (e: "close"): void;
}>();

const queryClient = useQueryClient();

const addMuscleMutation = useMutation({
  mutationFn: async (newMuscleName: string) => {
    const response = await fetch("/api/addMuscle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newMuscle: newMuscleName,
      }),
    });
    return response.json();
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["muscles"] });

    // const newMuskle = {
    //   muscle_name: newMuscleName.value,
    // };
    // if (muscles.value) {
    //   muscles.value[Number(data.id)] = newMuskle;
    // }
    emit("close");
  },
  onError: (error) => {
    console.error("Mutation failed:", error);
  },
});

const addMuscle = () => {
  if (newMuscleName.value) {
    addMuscleMutation.mutate(newMuscleName.value);
  }
};
</script>

<style scoped></style>
