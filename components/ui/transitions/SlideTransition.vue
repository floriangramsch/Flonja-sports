<template>
  <Transition name="slide-fade" mode="out-in">
    <slot />
  </Transition>
</template>
<style>
.slide-fade-enter-active {
  transition: all 0.12s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.12s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.no-x-scrollbar {
  overflow-x: hidden;
}
</style>
