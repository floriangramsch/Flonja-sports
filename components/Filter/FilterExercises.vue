<template>
  <button @click.stop="isOpen = !isOpen">
    <i
      class="fa-solid fa-magnifying-glass flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
    />
  </button>
  <DropdownSlideTransition>
    <div
      v-if="isOpen"
      class="fixed inset-0 h-screen w-screen"
      @click="handleOverlayClick"
    >
      <input
        v-if="isOpen"
        @click.stop
        class="absolute left-14 top-52 mr-10 rounded-md bg-sonja-text p-1 text-center text-2xl text-sonja-akz2 shadow-lg focus:outline-none focus:ring-2 focus:ring-sonja-akz"
        ref="input"
        v-model="search"
        @input="filter"
        @keydown="closeInput"
      />
    </div>
  </DropdownSlideTransition>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import DropdownSlideTransition from "../ui/transitions/DropdownSlideTransition.vue";

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

const handleOverlayClick = (e: MouseEvent) => {
  if (input.value && !input.value.contains(e.target as Node)) {
    isOpen.value = false;
    search.value = "";
  }
};
</script>
