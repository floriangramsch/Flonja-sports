<template>
  <button class="absolute right-0 bottom-0" @click="isOpen = !isOpen">
    <i class="fa-solid fa-filter text-sonja-akz"></i>
  </button>

  <div
    v-if="isOpen"
    class="mr-8 bg-sonja-akz rounded-md shadow-lg overflow-auto h-80"
  >
    <div
      v-for="(d, id) in data"
      :key="id"
      @click="filterData(Number(id))"
      class="flex py-0.5 px-2 cursor-pointer"
      :class="isFiltered(Number(id)) ? 'bg-sonja-akz2' : 'bg-sonja-akz'"
    >
      {{ getDisplayName(d) }}
    </div>
    <div
      @click="reset"
      class="border-t border-sonja-akz2 py-1 px-2 cursor-pointer"
    >
      Reset
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const filteredData = ref<number[]>([]);
const isOpen = ref<boolean>(false);

const props = defineProps<{
  data: any;
  displayProp: string;
}>();

const getDisplayName = (item: any) => {
  return item[props.displayProp];
};

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
  }
  filter.value = filteredData.value;
};

const reset = () => {
  filteredData.value = [];
  filter.value = [];
};
</script>
