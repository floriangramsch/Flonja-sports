<script setup lang="ts">
const props = defineProps<{
  default?: string;
  defaultSelected?: string;
  options: { value: number | string; label: string }[];
}>();

const model = defineModel();

onMounted(() => {
  if (props.defaultSelected !== undefined) {
    model.value = props.defaultSelected;
  }
});
</script>

<template>
  <div class="relative">
    <label
      :for="default"
      class="absolute left-2 top-0 -translate-y-1/2 rounded bg-sonja-akz p-[2px] text-xs text-black transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-base peer-placeholder-shown:text-sonja-akz2 peer-focus:top-0 peer-focus:rounded peer-focus:bg-sonja-akz peer-focus:p-[2px] peer-focus:text-xs peer-focus:text-sonja-text peer-focus:shadow"
    >
      {{ default }}
    </label>
    <select
      :id="default"
      v-model="model"
      class="w-full rounded-md bg-sonja-text p-2 text-sonja-akz2 focus:outline-none focus:ring-2 focus:ring-sonja-akz"
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
  </div>
</template>
