<script setup lang="ts">
import SlideTransition from '../ui/transitions/SlideTransition.vue';

defineProps<{
  route: WorkoutRouterTypes
}>()

const routerStore = useRouterStore();
</script>

<template>
  <SlideTransition>
    <div class="absolute inset-0" v-if="routerStore.workoutRoute === route">
      <slot />
    </div>
  </SlideTransition>
</template>
