<script setup lang="ts">
const props = defineProps<{
  isHours?: boolean;
  isMinutes?: boolean;
}>();

const items = props.isHours
  ? Array.from({ length: 24 }, (_, i) => i)
  : Array.from({ length: 60 }, (_, i) => i);

const scrollContainer = ref<HTMLDivElement | null>(null);
const currentItem = defineModel<number>({ default: 0 });

const getScaleClass = (item: number) => {
  if (item === currentItem.value) return "scale-100 text-sonja-akz";
  if (Math.abs(item - currentItem.value) === 1) return "scale-75";
  return "scale-50";
};
</script>

<template>
  <div class="flex items-center">
    <div
      ref="scrollContainer"
      class="noscrollbar flex max-h-48 snap-y snap-mandatory flex-col items-center overflow-y-scroll"
    >
      <div
        v-for="item in items"
        class="snap-center px-4 text-4xl transition-transform duration-200"
        :key="item"
        :class="getScaleClass(item)"
        @click="currentItem = item"
      >
        {{ item }}
      </div>
    </div>
    <div class="-ml-4 text-sm h-full">
      {{ isHours ? "Hours" : isMinutes ? "Min." : "Sec." }}
    </div>
  </div>
</template>
