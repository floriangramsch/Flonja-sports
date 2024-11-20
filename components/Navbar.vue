<script setup lang="ts">
const show = defineModel<any>();
const activeBounce = ref<string>("");
let bounceTimeout: ReturnType<typeof setTimeout> | undefined;

watch(show.value, (newVal) => {
  const timeout = 900;
  activeBounce.value = newVal.showRouter;

  if (bounceTimeout) {
    clearTimeout(bounceTimeout);
  }

  bounceTimeout = setTimeout(() => {
    activeBounce.value = "";
  }, timeout);
});

// Clear the timeout when the component is unmounted
onBeforeUnmount(() => {
  if (bounceTimeout) {
    clearTimeout(bounceTimeout);
  }
});
</script>

<template>
  <nav
    class="sticky bottom-0 w-full flex bg-sonja-bg border-t-2 border-sonja-bg-darker text-sonja-text text-2xl pb-7 pt-2"
  >
    <button @click="show.showRouter = 'exercises'" class="w-full">
      <i
        class="fa-solid fa-chart-line"
        :class="{
          'text-sonja-akz': show.showRouter === 'exercises',
          'fa-bounce': activeBounce === 'exercises',
        }"
      />
    </button>

    <button @click="show.showRouter = 'workoutdetail'" class="w-full">
      <i
        class="fa-solid fa-home"
        :class="{
          'text-sonja-akz': show.showRouter === 'workoutdetail',
          'fa-bounce': activeBounce === 'workoutdetail',
        }"
      />
    </button>

    <button @click="show.showRouter = 'equiplist'" class="w-full">
      <i
        class="fa-solid fa-dumbbell"
        :class="{
          'text-sonja-akz': show.showRouter === 'equiplist',
          'fa-bounce': activeBounce === 'equiplist',
        }"
      />
    </button>

    <button @click="show.showRouter = 'workouts'" class="w-full">
      <i
        class="fa-solid fa-calendar"
        :class="{
          'text-sonja-akz': show.showRouter === 'workouts',
          'fa-bounce': activeBounce === 'workouts',
        }"
      />
    </button>
  </nav>
</template>
