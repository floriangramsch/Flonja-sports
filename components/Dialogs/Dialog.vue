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
        class="absolute top-[15%] w-80 rounded bg-sonja-bg p-4 text-sonja-text shadow-md"
      >
        <button @click="close" class="ml-auto flex rounded bg-sonja-akz p-2">
          <i class="fa-solid fa-x"></i>
        </button>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

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
