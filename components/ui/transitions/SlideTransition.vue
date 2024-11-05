<template>
  <Transition name="fade" mode="out-in">
    <slot />
  </Transition>
</template>
<style>
.fade-enter-active {
  transition: all 0.1s ease-out;
}

.fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.no-x-scrollbar {
  overflow-x: hidden;
}
</style>
