<script setup lang="ts">
const newValue = defineModel();

const inputRef = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  focus?: boolean;
  placeholder?: string;
  label?: string;
}>();

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;

defineEmits<{
  (emit: "action"): void;
}>();

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
      v-model="newValue"
      type="time"
      value="00:00"
      class="remove-arrow peer h-12 w-32 rounded bg-sonja-text p-2 text-sonja-akz2 shadow focus:outline-none focus:ring-2 focus:ring-sonja-akz"
      ref="inputRef"
      :placeholder="placeholder ?? ' '"
      @focusout="$emit('action')"
    />
    <label
      :for="labelId"
      class="absolute left-2 -translate-y-2 rounded bg-sonja-akz p-[2px] text-xs shadow transition-all duration-200 peer-placeholder-shown:left-1 peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-base peer-placeholder-shown:text-sonja-akz2 peer-focus:left-2 peer-focus:top-0 peer-focus:bg-sonja-akz peer-focus:text-xs peer-focus:text-sonja-text"
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
