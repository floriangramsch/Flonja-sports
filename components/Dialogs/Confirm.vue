<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";

const isOpen = defineModel("isOpen");

defineProps<{
  class?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "no"): void;
  (e: "yes"): void;
}>();

const dialog = ref<HTMLElement | null>(null);

const handleOverlayClick = (e: MouseEvent) => {
  if (dialog.value && !dialog.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};
</script>

<template>
  <button
    v-if="$slots.default"
    :class="class"
    @click.stop="isOpen = true"
    :disabled="disabled"
  >
    <slot />
  </button>
  <div
    v-if="isOpen"
    @click="handleOverlayClick"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 text-xl"
  >
    <div
      @click.stop
      ref="dialog"
      class="fixed left-1/5 top-1/4 flex min-h-20 min-w-48 flex-col items-center justify-center rounded bg-sonja-bg px-3 py-6 text-sonja-text shadow"
    >
      <div v-if="!$slots['message']">Sure?</div>
      <div v-else>
        <slot name="message" />
      </div>
      <div class="mt-2 flex gap-4">
        <Button @action="emit('yes')"> Yes </Button>
        <Button @action="isOpen = false"> No </Button>
      </div>
    </div>
  </div>
</template>
