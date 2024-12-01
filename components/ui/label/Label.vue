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
      class="absolute left-2 -translate-y-1/2 rounded bg-sonja-akz p-[2px] text-xs text-black"
    >
      {{ label }}
    </label>
    <div
      :id="labelId"
      class="rounded p-2 text-sonja-akz2 shadow"
      :class="[selected ? 'bg-sonja-fg' : 'bg-sonja-text']"
    >
      {{ value }}
    </div>
  </div>
</template>
