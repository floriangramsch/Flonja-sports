<template>
  <i
    @click.stop="open"
    ref="openRef"
    class="fa-solid fa-magnifying-glass flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
  />
  <DropdownSlideTransition>
    <input
      v-if="isOpen"
      v-outside="close"
      class="absolute mr-10 translate-x-5 translate-y-12 rounded-md bg-sonja-text p-1 text-center text-2xl text-sonja-akz2 shadow-lg focus:outline-none focus:ring-2 focus:ring-sonja-akz"
      :class="class"
      ref="input"
      v-model="search"
      @input="filter"
      @keydown="closeInput"
      @blur="handleBlur"
    />
  </DropdownSlideTransition>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import DropdownSlideTransition from "../ui/transitions/DropdownSlideTransition.vue";

defineProps<{
  class?: string;
}>();

const search = ref<string>("");
const input = ref<HTMLElement | null>(null);
const isOpen = ref<boolean>(false);

const setFocus = () => {
  nextTick(() => {
    input.value?.focus();
  });
};

watch(isOpen, () => {
  if (isOpen) {
    setFocus();
  }
});

const model = defineModel<string>();

const filter = () => {
  model.value = search.value;
};

const open = () => {
  if (!isOpen.value) {
    isOpen.value = true;
  }
  if (model.value) {
    model.value = undefined;
  }
};

const close = (e: MouseEvent) => {
  if (openRef.value && !openRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

const closeInput = (event: KeyboardEvent | MouseEvent) => {
  if (event instanceof KeyboardEvent) {
    if (event.key === "Escape") {
      search.value = "";
      model.value = "";
      isOpen.value = false;
    } else if (event.key === "Enter") {
      if (search.value === "") {
        model.value = "";
      }
      search.value = "";
      isOpen.value = false;
    }
  }
};

const handleBlur = () => {
  if (search.value === "") {
    model.value = "";
  }
  search.value = "";
  isOpen.value = false;
};

const openRef = ref<HTMLElement>();
</script>
