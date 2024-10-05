<template>
  <div
    @click="handleOverlayClick"
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-xl"
  >
    <div
      @click.stop
      ref="dialog"
      class="bg-sonja-fg text-sonja-text p-4 rounded shadow-md w-80"
    >
      <button
        @click="close"
        class="flex ml-auto bg-sonja-akz p-2 rounded"
      >
        <i class="fa-solid fa-x"></i>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

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
