<template>
  <slot name="trigger" />
  <Transition name="fade">
    <div
      @click="handleOverlayClick"
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 text-xl"
    >
      <div
        @click.stop
        ref="dialog"
        class="absolute top-[15%] max-h-[80%] rounded bg-sonja-bg p-4 text-sonja-text shadow-md"
        :class="{ 'overflow-scroll': overflowScroll ? true : false }"
        :style="{ width: w }"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  w: {
    type: String,
    default: "20rem",
  },
  overflowScroll: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};

const dialog = ref<HTMLElement | null>(null);

const handleOverlayClick = (e: MouseEvent) => {
  if (dialog.value && !dialog.value.contains(e.target as Node)) {
    close();
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
