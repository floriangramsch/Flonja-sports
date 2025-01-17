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

watch([hours, minutes, seconds], setTime);

onMounted(() => {
  newValue.value = 0;
  if (props.focus && inputRef.value) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <div class="flex w-full items-center justify-center gap-2 border-4 rounded p-2 border-sonja-text">
    <TimeInput isHours v-model="hours" />
    <TimeInput isMinutes v-model="minutes" />
    <TimeInput v-model="seconds" />
  </div>
</template>
