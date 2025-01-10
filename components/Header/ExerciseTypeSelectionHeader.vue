<script setup lang="ts">
const types = ["All", "Machine", "Bodyweight", "Dumbbell"];
const metricTypes = ["All", "Time", "Weight"];

const selected = ref<string>("All");
const selectedMetric = ref<string>("All");

defineExpose({ selected, selectedMetric });
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center">
      <div
        class="noscrollbar flex w-full justify-center gap-1 overflow-x-scroll text-sm"
      >
        <div
          v-for="type in types"
          :key="type"
          class="cursor-pointer rounded px-2 py-1 shadow"
          :class="{
            'bg-sonja-akz': selected === type,
            'bg-sonja-text text-sonja-akz2': selected !== type,
          }"
          @click.stop="selected = type"
        >
          {{ type }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div
        class="noscrollbar flex w-full justify-center gap-1 overflow-x-scroll text-sm"
      >
        <div
          v-for="type in metricTypes"
          :key="type"
          class="cursor-pointer rounded px-2 py-1 shadow"
          :class="{
            'bg-sonja-akz': selectedMetric === type,
            'bg-sonja-text text-sonja-akz2': selectedMetric !== type,
          }"
          @click.stop="selectedMetric = type"
        >
          {{ type }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.noscrollbar::-webkit-scrollbar {
  display: none;
}
.noscrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
