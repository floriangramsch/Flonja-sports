<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  selected?: boolean;
}>();

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;
</script>

<template>
  <div class="relative">
    <label
      :for="labelId"
      class="absolute left-2 -translate-y-1/2 text-black p-[2px] text-xs rounded bg-sonja-akz"
    >
      {{ label }}
    </label>
    <div
      :id="labelId"
      class="p-2 rounded shadow text-sonja-akz2"
      :class="[selected ? 'bg-sonja-fg' : 'bg-sonja-text']"
    >
      {{ value }}
    </div>
  </div>
</template>
