<template>
  <NuxtLayout>
    <MainPage class="bg-sonja-bg" />
  </NuxtLayout>
</template>

<script setup>
import MainPage from "./components/MainPage.vue";
if (process.client) {
  window.addEventListener("contextmenu", (e) => e.preventDefault());
}
</script>
