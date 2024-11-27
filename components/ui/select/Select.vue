<script setup lang="ts">
defineProps<{
  default: string;
  options: any;
}>();

const model = defineModel();
</script>

<template>
  <select
    v-model="model"
    class="p-2 rounded-md bg-sonja-text text-sonja-akz2 w-1/2 focus:outline-none focus:ring-2 focus:ring-sonja-akz"
  >
    <option value="undefined" disabled>{{default}}</option>
    <option
      v-for="muscle in options"
      :key="muscle.muscle_group_id"
      :value="muscle.muscle_group_id"
      class="py-1"
    >
      {{ muscle.muscle_name }}
    </option>
  </select>
</template>
