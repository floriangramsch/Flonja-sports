<script setup lang="ts">
import { ref } from "vue";
import SlideDownTransition from "../ui/transitions/SlideDownTransition.vue";

const filteredData = ref<number[]>([]);
const isOpen = ref<boolean>(false);
const isOpenOptions = ref<boolean>(false);

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
  isOpenOptions.value = false;
};

const filterRef = ref<HTMLElement | null>(null);

const handleOverlayClick = (e: MouseEvent) => {
  if (filterRef.value && !filterRef.value.contains(e.target as Node)) {
    isOpenOptions.value = false;
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
  <slot :openDialog="toggle" />
  <SlideDownTransition>
    <!-- @click="handleOverlayClick" -->
    <div v-if="isOpen" class="relative flex justify-evenly">
      <div @click.stop="isOpenOptions = !isOpenOptions">
        <slot name="name" />
      </div>

      <SlideDownTransition>
        <div
          v-if="isOpenOptions"
          class="absolute inset-0 w-screen h-screen"
          @click="handleOverlayClick"
        >
          <div
            @click.stop
            ref="filterRef"
            class="absolute left-9 top-12 bg-sonja-text text-sonja-akz2 rounded-md shadow-lg text-nowrap overflow-scroll max-h-80 max-w-48"
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
      <slot name="content" />
    </div>
  </SlideDownTransition>
</template>
