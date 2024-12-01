<template>
  <Transition name="slide-fade-dropdown">
    <slot />
  </Transition>
</template>

<style scoped>
.slide-fade-dropdown-enter-active,
.slide-fade-dropdown-leave-active {
  transition:
    max-height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  overflow: hidden;
}

.slide-fade-dropdown-enter-from,
.slide-fade-dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-fade-dropdown-enter-to,
.slide-fade-dropdown-leave-from {
  max-height: 1000px; /* Setzen Sie dies auf eine ausreichend große Höhe */
  opacity: 1;
}
</style>
