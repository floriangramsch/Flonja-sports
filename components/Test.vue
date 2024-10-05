<template>
  <div class="bg-sonja-bg">
    {{ test }}
    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>{{ data }}</div>
  </div>
</template>

<script lang="ts" setup>
const { data, status, error } = await useFetch("/api/getData");
const test = ref("hi");
</script>
