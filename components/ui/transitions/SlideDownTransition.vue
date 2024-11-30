<template>
  <Transition name="slide-fade-dropdown" mode="out-in">
    <slot />
  </Transition>
</template>
<style scoped>
.slide-fade-dropdown-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-dropdown-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-dropdown-enter-from,
.slide-fade-dropdown-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
