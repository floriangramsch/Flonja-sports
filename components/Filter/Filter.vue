<script setup lang="ts">
import SlideDownTransition from "../ui/transitions/SlideDownTransition.vue";

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
  }
  filter.value = filteredData.value;
};

const reset = () => {
  filteredData.value = [];
  filter.value = [];
  isOpen.value = false;
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

function open(e: MouseEvent) {
  isOpen.value = true;
}

function close(e: MouseEvent) {
  if (openRef.value && !openRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

defineExpose({
  toggle,
});

const openRef = ref<HTMLElement>();
</script>

<template>
  <div>
    <i
      @click.stop="open"
      ref="openRef"
      class="fa-solid fa-hand relative flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
    />
    <SlideDownTransition>
      <div
        v-if="isOpen"
        v-outside="close"
        class="absolute z-50 max-h-80 max-w-48 -translate-x-1/4 translate-y-2 overflow-scroll text-nowrap rounded-md bg-sonja-text text-sonja-akz2 shadow-lg"
      >
        <div
          @click="reset"
          class="w-full cursor-pointer border-b border-sonja-akz2 px-2 py-1"
        >
          Reset
        </div>
        <div
          v-for="d in data"
          :key="d.id"
          @click="filterData(d.id)"
          class="flex cursor-pointer px-2 py-0.5"
          :class="isFiltered(d.id) ? 'bg-sonja-akz' : 'bg-sonja-text'"
        >
          {{ d.name }}
        </div>
      </div>
    </SlideDownTransition>
  </div>
</template>
