<script setup lang="ts">
import SlideDownTransition from "../ui/transitions/SlideDownTransition.vue";

const isOpen = ref<boolean>(false);

const toggle = () => (isOpen.value = !isOpen.value);

defineExpose({
  toggle,
});
</script>

<template>
  <SlideDownTransition>
    <div
      v-show="isOpen"
      class="flex w-full justify-evenly overflow-hidden pb-1"
    >
      <slot />
    </div>
  </SlideDownTransition>
</template>
