<script setup lang="ts">
const props = defineProps<{
  selectorRef?: HTMLDivElement;
  isHours?: boolean;
  isMinutes?: boolean;
}>();

const items = props.isHours
  ? Array.from({ length: 28 }, (_, i) => i - 2)
  : Array.from({ length: 64 }, (_, i) => i - 2);

const scrollContainer = ref<HTMLDivElement | null>(null);
const currentItem = defineModel<number>({ default: 0 });

const getScaleClass = (item: number) => {
  if (item === currentItem.value) return "scale-100 text-sonja-akz";
  if (Math.abs(item - currentItem.value) === 1) return "scale-75";
  return "scale-50";
};

const calculateVisibleItem = () => {
  if (!scrollContainer.value) return;

  const containerRect = scrollContainer.value.getBoundingClientRect();
  const containerCenter = containerRect.top + containerRect.height / 2;

  let closestItem = items[0];
  let closestDistance = Infinity;

  items.forEach((item) => {
    const itemElement = scrollContainer.value?.children[item] as HTMLElement;
    if (!itemElement) return;

    const itemRect = itemElement.getBoundingClientRect();
    const itemCenter = itemRect.top + itemRect.height / 2;
    const distance = Math.abs(itemCenter - containerCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item - 2;
    }
  });

  currentItem.value = closestItem;
};

const onScroll = () => {
  calculateVisibleItem();
};

onMounted(() => {
  calculateVisibleItem();
});
</script>

<template>
  <div class="flex items-center">
    <div
      ref="scrollContainer"
      class="noscrollbar flex max-h-48 snap-y snap-mandatory flex-col items-center overflow-y-scroll"
      @scroll="onScroll"
    >
      <div
        v-for="item in items"
        class="min-h-10 snap-center px-4 text-4xl transition-transform duration-200"
        :key="item"
        :class="getScaleClass(item)"
      >
        {{ 0 <= item && item < (isHours ? 24 : 60) ? item : "" }}
      </div>
    </div>
    <div class="-ml-4 h-full text-sm">
      {{ isHours ? "Hours" : isMinutes ? "Min." : "Sec." }}
    </div>
  </div>
</template>
