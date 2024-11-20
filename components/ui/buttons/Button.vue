<script setup lang="ts">
const emit = defineEmits(["action"]);
</script>

<template>
  <button
    class="p-2 bg-sonja-text text-sonja-akz2 rounded"
    @click.prevent="emit('action')"
  >
    <slot />
  </button>
</template>
