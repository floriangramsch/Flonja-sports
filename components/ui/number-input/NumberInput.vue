<script setup lang="ts">
const newValue = defineModel();

const inputRef = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  focus?: boolean;
}>();

watch(
  () => inputRef.value,
  (newVal) => {
    if (newVal) {
      newVal.focus();
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
    class="w-10 remove-arrow"
    :ref="focus ? 'inputRef' : ''"
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
