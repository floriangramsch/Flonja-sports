<script setup lang="ts">
const newValue = defineModel();

const inputRef = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  focus?: boolean;
  placeholder?: string;
}>();

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
  <input
    v-model="newValue"
    type="number"
    inputmode="numeric"
    pattern="[0-9]*"
    class="w-10 remove-arrow focus:outline-none focus:ring-2 focus:ring-sonja-akz"
    ref="inputRef"
    :placeholder="placeholder"
  />
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
