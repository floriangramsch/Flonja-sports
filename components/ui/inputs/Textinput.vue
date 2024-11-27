<script setup lang="ts">
const props = defineProps<{
  label?: string;
}>();

const model = defineModel();

const id = `input-${Math.random().toString(36).slice(2, 9)}`;
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      class="peer p-2 rounded shadow bg-sonja-text text-sonja-akz2 focus:outline-none focus:ring-2 focus:ring-sonja-akz"
      v-model="model"
      placeholder=" "
    />
    <label
      :for="id"
      class="absolute left-2 transform text-black p-[2px] text-xs rounded bg-sonja-akz transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-sonja-akz2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sonja-text peer-focus:bg-sonja-akz peer-focus:p-[2px] peer-focus:rounded peer-focus:text-xs peer-focus:shadow peer-not-placeholder:bg-red"
    >
      {{ label }}
    </label>
  </div>
</template>

<style scoped>
.transform {
  transform: translateY(-50%);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
