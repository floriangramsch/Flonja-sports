<script setup lang="ts">
const newValue = defineModel();

const inputRef = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  focus?: boolean;
  placeholder?: string;
  label?: string;
}>();

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;

watch(
  () => props.focus,
  (newVal) => {
    if (newVal) {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    }
  }
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
      v-model="newValue"
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      class="peer w-16 h-12 remove-arrow focus:outline-none focus:ring-2 focus:ring-sonja-akz bg-sonja-text text-sonja-akz2 p-2 rounded shadow"
      ref="inputRef"
      :placeholder="placeholder ?? ' '"
    />
    <label
      :for="labelId"
      class="absolute transition-all duration-200 left-2 -translate-y-2 text-xs bg-sonja-akz p-[2px] rounded shadow peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:left-1 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-sonja-akz2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:left-2 peer-focus:text-sonja-text peer-focus:bg-sonja-akz peer-focus:text-xs"
    >
      {{ label }}
    </label>
  </div>
</template>

<style scoped>
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.remove-arrow {
  appearance: none;
  -moz-appearance: textfield;
}
</style>
