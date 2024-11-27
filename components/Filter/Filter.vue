<script setup lang="ts">
import { ref } from "vue";
import DropdownSlideTransition from "../ui/transitions/DropdownSlideTransition.vue";

const filteredData = ref<number[]>([]);
const isOpen = ref<boolean>(false);

defineProps<{
  data: { id: number; name: string }[] | undefined;
}>();

const isFiltered = (id: number) => {
  return filteredData.value.includes(id);
};

const filter = defineModel<number[]>();

// update die zu filternden Daten
const filterData = (id: number) => {
  if (isFiltered(id)) {
    filteredData.value = filteredData.value.filter((dataId) => dataId !== id);
  } else {
    filteredData.value.push(id);
    isOpen.value = false;
  }
  filter.value = filteredData.value;
};

const reset = () => {
  filteredData.value = [];
  filter.value = [];
  isOpen.value = false;
};

const filterRef = ref<HTMLElement | null>(null);

const handleOverlayClick = (e: MouseEvent) => {
  if (filterRef.value && !filterRef.value.contains(e.target as Node)) {
    reset();
  }
};
</script>

<template>
  <button class="fixed right-2 bottom-52 z-10" @click.stop="isOpen = !isOpen">
    <i class="fa-solid fa-filter text-sonja-akz text-3xl" />
  </button>

  <DropdownSlideTransition>
    <div
      v-if="isOpen"
      @click="handleOverlayClick"
      class="fixed inset-0 flex h-screen w-screen"
    >
      <div
        v-if="isOpen"
        @click.stop
        ref="filterRef"
        class="fixed right-10 bottom-52 bg-sonja-text text-sonja-akz2 rounded-md shadow-lg text-nowrap overflow-scroll max-h-80 max-w-48"
      >
        <div
          v-for="d in data"
          :key="d.id"
          @click="filterData(d.id)"
          class="flex py-0.5 px-2 cursor-pointer"
          :class="isFiltered(d.id) ? 'bg-sonja-akz' : 'bg-sonja-text'"
        >
          {{ d.name }}
        </div>
        <div
          @click="reset"
          class="border-t border-sonja-akz2 py-1 px-2 cursor-pointer w-full"
        >
          Reset
        </div>
      </div>
    </div>
  </DropdownSlideTransition>
</template>
