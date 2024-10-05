<template>
  <button class="absolute right-0 bottom-0" @click="isOpen = !isOpen">
    <i class="fa-solid fa-magnifying-glass text-sonja-akz"></i>
  </button>
  <div v-if="isOpen" class="mr-10 bg-sonja-akz rounded-md shadow-lg">
    <input class="text-2xl" ref="input" v-model="search" @input="filter" @keydown="closeInput" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

const search = ref<string>("");
const input = ref<HTMLElement | null>(null);
const isOpen = ref<boolean>(false);

defineProps<{
  equips: EquipType;
}>();

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

const closeInput = (event: KeyboardEvent) => {
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
};
</script>
