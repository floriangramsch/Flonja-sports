<script setup lang="ts">
defineProps<{
  content: string;
  type: string;
  animated?: boolean
}>();
</script>

<template>
  <div
    class="rounded p-1 text-xs/[8px] shadow"
    :class="{
      'bg-sonja-akz': type === 'muscle',
      'bg-sonja-fg text-sonja-akz2': type === 'exercise',
      'bg-yellow-500': type === 'metric',
      'bg-red-700': type === 'exerciseType',
      'transition-all duration-300 group-hover:-right-8 group-hover:-translate-y-2 group-hover:-rotate-[20deg]': animated,
    }"
  >
    {{ content }}
  </div>
</template>
