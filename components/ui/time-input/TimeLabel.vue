<script setup lang="ts">
import TimeInput from "./TimeInput.vue";

const newValue = defineModel();

const inputRef = ref<HTMLInputElement | null>(null);
const hours = ref<number>(0);
const minutes = ref<number>(0);
const seconds = ref<number>(0);

const props = defineProps<{
  focus?: boolean;
  placeholder?: string;
  label?: string;
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

const setTime = () => {
  newValue.value = 60 * 60 * hours.value + 60 * minutes.value + seconds.value;
};

const selectorRef = ref<HTMLDivElement | undefined>();

watch([hours, minutes, seconds], setTime);

onMounted(() => {
  newValue.value = 0;
  if (props.focus && inputRef.value) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <div class="relative flex w-full items-center justify-center gap-2 p-2">
    <div
      ref="selectorRef"
      class="pointer-events-none absolute top-1/2 h-9 w-full -translate-y-5 rounded bg-sonja-akz opacity-50"
    />
    <TimeInput isHours v-model="hours" :selectorRef="selectorRef" />
    <TimeInput isMinutes v-model="minutes" :selectorRef="selectorRef" />
    <TimeInput v-model="seconds" :selectorRef="selectorRef" />
  </div>
</template>
