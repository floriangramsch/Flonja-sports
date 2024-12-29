<script setup lang="ts">
import SlideTransition from '../ui/transitions/SlideTransition.vue';

defineProps<{
  route: RouterTypes
}>()

const routerStore = useRouterStore();
</script>

<template>
  <SlideTransition>
    <div class="absolute inset-0" v-if="routerStore.route === route">
      <slot />
    </div>
  </SlideTransition>
</template>
