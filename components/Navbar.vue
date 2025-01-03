<script setup lang="ts">
const routerStore = useRouterStore();
const activeBounce = ref<string>("");
let bounceTimeout: ReturnType<typeof setTimeout> | undefined;

watch(
  () => routerStore.route,
  (newVal) => {
    const timeout = 900;
    activeBounce.value = newVal;

    if (bounceTimeout) {
      clearTimeout(bounceTimeout);
    }

    bounceTimeout = setTimeout(() => {
      activeBounce.value = "";
    }, timeout);
  },
);

// Clear the timeout when the component is unmounted
onBeforeUnmount(() => {
  if (bounceTimeout) {
    clearTimeout(bounceTimeout);
  }
});
</script>

<template>
  <nav
    class="sticky bottom-0 flex w-full border-t-2 border-sonja-bg-darker bg-sonja-bg pb-7 pt-2 text-2xl text-sonja-text"
  >
    <button @click="routerStore.route = 'workoutexercises'" class="w-full">
      <i
        class="fa-solid fa-chart-line"
        :class="{
          'text-sonja-akz': routerStore.route === 'workoutexercises',
          'fa-bounce': activeBounce === 'workoutexercises',
        }"
      />
    </button>

    <button @click="routerStore.route = 'plans'" class="w-full">
      <i
        class="fa-solid fa-calendar"
        :class="{
          'text-sonja-akz': routerStore.route === 'plans',
          'fa-bounce': activeBounce === 'plans',
        }"
      />
    </button>

    <button @click="routerStore.route = 'workoutpage'" class="w-full">
      <i
        class="fa-solid fa-home"
        :class="{
          'text-sonja-akz': routerStore.route === 'workoutpage',
          'fa-bounce': activeBounce === 'workoutpage',
        }"
      />
    </button>

    <button @click="routerStore.route = 'exerciselist'" class="w-full">
      <i
        class="fa-solid fa-dumbbell"
        :class="{
          'text-sonja-akz':
            routerStore.route === 'exerciselist' ||
            routerStore.route === 'categorylist',
          'fa-bounce': activeBounce === 'exerciselist',
        }"
      />
    </button>

    <button @click="routerStore.route = 'stats'" class="w-full">
      <i
        class="fa-solid fa-weight-scale"
        :class="{
          'text-sonja-akz':
            routerStore.route === 'stats' || routerStore.route === 'workouts',
          'fa-bounce': activeBounce === 'stats',
        }"
      />
    </button>
  </nav>
</template>
