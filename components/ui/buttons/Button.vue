<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits(["action"]);
</script>

<template>
  <button
    class="rounded bg-sonja-text p-2 text-sonja-akz2 cursor-pointer"
    :disabled="disabled"
    @click.prevent="emit('action')"
  >
    <slot />
  </button>
</template>
