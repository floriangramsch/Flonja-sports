<script setup lang="ts">
const types = ["muscle", "exercise"];

const selected = ref<string>("muscle");
defineExpose({ selected });
</script>

<template>
  <div class="flex items-center">
    <div
      class="noscrollbar flex w-full justify-around overflow-x-scroll text-base"
    >
      <div
        v-for="type in types"
        :key="type"
        class="mx-1 cursor-pointer rounded px-2 py-1 shadow"
        :class="{
          'bg-sonja-akz': selected === type,
          'bg-sonja-text text-sonja-akz2': selected !== type,
        }"
        @click.stop="selected = type"
      >
        {{ type.charAt(0).toUpperCase() + type.slice(1) }}
      </div>
    </div>
  </div>
</template>
<!-- 
<style scoped>
.noscrollbar::-webkit-scrollbar {
  display: none;
}
.noscrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style> -->
