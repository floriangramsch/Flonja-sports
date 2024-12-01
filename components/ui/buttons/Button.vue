<script setup lang="ts">
const emit = defineEmits(["action"]);
</script>

<template>
  <button
    class="rounded bg-sonja-text p-2 text-sonja-akz2"
    @click.prevent="emit('action')"
  >
    <slot />
  </button>
</template>
