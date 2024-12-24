<script setup lang="ts">
import Button from "../buttons/Button.vue";

const props = defineProps<{
  exerciseId: number | undefined;
  info: string | undefined;
}>();

const newInfo = ref<string | undefined>(props.info);
const editInfo = defineModel<boolean>("editInfo");
const infoRef = ref<HTMLTextAreaElement | null>(null);

const updateExerciseMutation = useUpdateExercise();
const updateInfo = () => {
  if (props.exerciseId) {
    updateExerciseMutation.mutate(
      {
        updatedData: `info = '${newInfo.value}'`,
        exercise_id: props.exerciseId,
      },
      {
        onSuccess: () => {
          editInfo.value = false;
        },
      },
    );
  }
};

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;

watch(
  () => infoRef.value,
  (newVal) => {
    if (newVal) newVal.focus();
  },
);
</script>

<template>
  <div class="relative">
    <div
      v-if="!editInfo"
      @click="editInfo = true"
      class="flex h-48 w-48 flex-col whitespace-pre text-wrap rounded border-2 border-sonja-text bg-sonja-text p-2 text-sonja-akz2 shadow"
    >
      {{ info }}
    </div>
    <div class="flex flex-col gap-4" v-else>
      <textarea
        :id="labelId"
        class="peer h-48 w-48 rounded border-2 border-sonja-text bg-sonja-text p-2 text-sonja-akz2 shadow focus:outline-none focus:ring-2 focus:ring-sonja-akz"
        v-model="newInfo"
        ref="infoRef"
      />
      <Button @action="updateInfo"> Done </Button>
    </div>
    <label
      :for="labelId"
      class="absolute -top-2 left-2 rounded bg-sonja-akz p-[2px] text-xs text-sonja-text shadow"
    >
      Info
    </label>
  </div>
</template>
