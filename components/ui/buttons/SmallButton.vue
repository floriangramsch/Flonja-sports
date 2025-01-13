<script setup lang="ts">
defineEmits<{
  (e: "action"): void;
}>();
</script>
<template>
  <button
    @click.stop="$emit('action')"
    class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
  >
    <slot />
  </button>
</template>
