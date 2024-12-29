<script setup lang="ts">
// Pull to Refresh
const startY = ref(0); // Startpunkt des Touches
const currentY = ref(0); // Aktuelle Position während des Moves
const isPulling = ref(false); // Status des Pulls
const loading = ref(false);

const onTouchStart = (e: TouchEvent) => {
  if (window.scrollY === 0) {
    startY.value = e.touches[0].clientY;
    isPulling.value = true;
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (isPulling.value) {
    currentY.value = e.touches[0].clientY;

    const pullDistance = currentY.value - startY.value;
    loading.value = false;
    if (pullDistance > 600) {
      loading.value = true;
    }
  }
};

const handleRefresh = async () => {
  await refresh();
};

const refresh = useRefresh();

const onTouchEnd = () => {
  if (isPulling.value) {
    const pullDistance = currentY.value - startY.value;
    if (pullDistance > 600) {
      handleRefresh();
    }
    isPulling.value = false;
    loading.value = false;
    startY.value = 0;
    currentY.value = 0;
  }
};
</script>

<template>
  <div
    v-if="isPulling"
    class="fixed left-0 right-0 top-0 flex h-20 items-center justify-center bg-sonja-text text-3xl"
  >
    <span v-if="loading">Loading</span>
    <span v-else-if="isPulling">Pulling</span>
  </div>
  <div
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <slot />
  </div>
</template>
