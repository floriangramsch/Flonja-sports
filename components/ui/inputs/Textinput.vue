<script setup lang="ts">
const props = defineProps<{
  label?: string;
  focus?: boolean;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const model = defineModel();

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;

watch(
  () => props.focus,
  (newVal) => {
    if (newVal) {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    }
  },
);

onMounted(() => {
  if (props.focus && inputRef.value) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <div class="relative">
    <input
      :id="labelId"
      class="peer rounded bg-sonja-text p-2 text-sonja-akz2 shadow focus:outline-none focus:ring-2 focus:ring-sonja-akz"
      v-model="model"
      placeholder=" "
      ref="inputRef"
    />
    <label
      :for="labelId"
      class="absolute left-2 -translate-y-1/2 rounded bg-sonja-akz p-[2px] text-xs text-black transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-base peer-placeholder-shown:text-sonja-akz2 peer-focus:top-0 peer-focus:rounded peer-focus:bg-sonja-akz peer-focus:p-[2px] peer-focus:text-xs peer-focus:text-sonja-text peer-focus:shadow"
    >
      {{ label }}
    </label>
  </div>
</template>
