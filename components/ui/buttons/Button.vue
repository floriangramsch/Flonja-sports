<script setup lang="ts">
defineProps<{
  disabled?: boolean;
  class?: string;
}>();

const emit = defineEmits(["action"]);
</script>

<template>
  <button
    class="cursor-pointer rounded bg-sonja-text p-2 text-sonja-akz2"
    :class="class"
    :disabled="disabled"
    @click.prevent="emit('action')"
  >
    <slot />
  </button>
</template>
