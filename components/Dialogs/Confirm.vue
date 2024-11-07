<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";

const isOpen = defineModel("isOpen");

defineProps<{
  class?: string;
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
  <button v-if="$slots.default" :class="class" @click.stop="isOpen = true">
    <slot />
  </button>
  <div
    v-if="isOpen"
    @click="handleOverlayClick"
    class="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 text-xl z-50"
  >
    <div
      @click.stop
      ref="dialog"
      class="flex flex-col justify-center items-center fixed bg-sonja-bg p-12 py-14 w-48 h-20 top-1/4 left-1/4 text-sonja-text rounded shadow"
    >
      <div>Sure?</div>
      <div class="flex gap-4 mt-2">
        <Button @action="emit('yes')"> Yes </Button>
        <Button @action="isOpen = false"> No </Button>
      </div>
    </div>
  </div>
</template>
