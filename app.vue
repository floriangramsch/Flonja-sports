<template>
  <NuxtLayout>
    <MainPage />
  </NuxtLayout>
</template>

<script setup>
if (process.client) {
  window.addEventListener("contextmenu", (e) => e.preventDefault());
}
</script>
