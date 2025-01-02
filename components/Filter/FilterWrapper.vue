<script setup lang="ts">
import SlideDownTransition from "../ui/transitions/SlideDownTransition.vue";

const props = defineProps<{
  open?: boolean
}>()

const isOpen = ref<boolean>(props.open);

const toggle = () => (isOpen.value = !isOpen.value);
const close = () => isOpen.value = false

defineExpose({
  toggle, close
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
