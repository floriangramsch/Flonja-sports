<script setup lang="ts">
defineProps<{
  leftIcon?: string;
  rightIcon?: string;
}>();
</script>

<template>
  <div class="relative flex w-full items-center justify-center py-4">
    <div v-if="$slots['left-pure']" class="absolute left-4">
      <slot name="left-pure" />
    </div>
    <button
      v-if="leftIcon"
      @click.stop="$emit('left')"
      class="absolute left-4 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
    >
      <i :class="leftIcon" />
    </button>

    <div
      class="flex h-full max-w-72 items-center justify-center text-wrap text-center text-4xl font-bold"
    >
      <slot />
    </div>

    <button
      v-if="rightIcon"
      @click.stop="$emit('right')"
      class="absolute right-4 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
    >
      <i :class="rightIcon" />
    </button>
    <div v-if="$slots['right-pure']" class="absolute right-4">
      <slot name="right-pure" />
    </div>
  </div>
</template>
