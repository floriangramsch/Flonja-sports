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
        class="fa-solid fa-hand flex items-center bg-sonja-bg-darker text-sonja-text h-10 px-4 rounded-full shadow"
      />
    </div>
    <SlideDownTransition>
      <div
        v-if="isOpen"
        class="fixed inset-0 w-screen h-screen"
        @click="handleOverlayClick"
      >
        <div
          @click.stop
          ref="filterRef"
          class="absolute bg-sonja-text top-40 text-sonja-akz2 rounded-md shadow-lg text-nowrap overflow-scroll max-h-80 max-w-48"
          style="transform: translate(40px, 40px)"
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
    </SlideDownTransition>
  </div>
</template>
