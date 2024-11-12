<template>
  <Transition name="slide-fade" mode="in-out">
    <slot />
  </Transition>
</template>
<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  position: absolute;
  top: 0;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

.no-x-scrollbar {
  overflow-x: hidden;
}
</style>
