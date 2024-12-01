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

const filterRef = ref<HTMLElement | null>(null);

const handleOverlayClick = (e: MouseEvent) => {
  if (filterRef.value && !filterRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

defineExpose({
  toggle,
});
</script>

<template>
  <div class="relative">
    <div @click.stop="isOpen = !isOpen">
      <i
        class="fa-solid fa-hand flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
      />
    </div>
    <SlideDownTransition>
      <div
        v-if="isOpen"
        class="fixed inset-0 h-screen w-screen"
        @click="handleOverlayClick"
      >
        <div
          @click.stop
          ref="filterRef"
          class="absolute top-40 max-h-80 max-w-48 overflow-scroll text-nowrap rounded-md bg-sonja-text text-sonja-akz2 shadow-lg"
          style="transform: translate(40px, 40px)"
        >
          <div
            v-for="d in data"
            :key="d.id"
            @click="filterData(d.id)"
            class="flex cursor-pointer px-2 py-0.5"
            :class="isFiltered(d.id) ? 'bg-sonja-akz' : 'bg-sonja-text'"
          >
            {{ d.name }}
          </div>
          <div
            @click="reset"
            class="w-full cursor-pointer border-t border-sonja-akz2 px-2 py-1"
          >
            Reset
          </div>
        </div>
      </div>
    </SlideDownTransition>
  </div>
</template>
