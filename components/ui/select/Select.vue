<script setup lang="ts">
const props = defineProps<{
  default?: string;
  defaultSelected?: string;
  options: {value: number | string, label: string}[];
}>();

const model = defineModel();

onMounted(() => {
  if (props.defaultSelected !== undefined) {
    model.value = props.defaultSelected;
  }
});
</script>

<template>
  <select
    v-model="model"
    class="w-1/2 rounded-md bg-sonja-text p-2 text-sonja-akz2 focus:outline-none focus:ring-2 focus:ring-sonja-akz"
  >
    <option v-if="default" value="undefined" disabled>{{default}}</option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="py-1"
    >
      {{ option.label }}
    </option>
  </select>
</template>
