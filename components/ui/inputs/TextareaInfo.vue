<script setup lang="ts">
import Button from "../buttons/Button.vue";

const props = defineProps<{
  equipId: number | undefined;
  info: string | undefined;
}>();

const newInfo = ref<string | undefined>(props.info);
const editInfo = defineModel<boolean>("editInfo");
const infoRef = ref<HTMLTextAreaElement | null>(null);

const updateEquipMutation = useUpdateEquip();
const updateInfo = () => {
  if (props.equipId) {
    updateEquipMutation.mutate(
      {
        updatedData: `info = '${newInfo.value}'`,
        equip_id: props.equipId,
      },
      {
        onSuccess: () => {
          editInfo.value = false;
        },
      }
    );
  }
};

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;

watch(
  () => infoRef.value,
  (newVal) => {
    if (newVal) newVal.focus();
  }
);
</script>

<template>
  <div class="relative">
    <div
      v-if="!editInfo"
      @click="editInfo = true"
      class="flex flex-col text-wrap w-48 h-48 border-2 border-sonja-text p-2 rounded shadow bg-sonja-text text-sonja-akz2 whitespace-pre"
    >
      {{ info }}
      s
    </div>
    <div class="flex flex-col gap-4" v-else>
      <textarea
        :id="labelId"
        class="peer w-48 h-48 border-2 border-sonja-text rounded p-2 shadow bg-sonja-text text-sonja-akz2 focus:ring-2 focus:ring-sonja-akz focus:outline-none"
        v-model="newInfo"
        ref="infoRef"
      />
      <Button @action="updateInfo"> Done </Button>
    </div>
    <label
      :for="labelId"
      class="absolute shadow bg-sonja-akz text-sonja-text text-xs p-[2px] rounded left-2 -top-2"
    >
      Info
    </label>
  </div>
</template>
