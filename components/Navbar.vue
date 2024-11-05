<script setup lang="ts">
const show = defineModel<any>();
</script>

<template>
  <nav
    class="fixed bottom-0 w-full flex justify-evenly bg-sonja-bg border-t-2 border-sonja-bg-darker text-sonja-text"
  >
    <div class="flex-grow">
      <button
        @click="show.showRouter = 'exercises'"
        class="text-lg border-sonja-bg pt-2 pb-10 w-full"
      >
        <i
          v-if="show.showRouter === 'exercises'"
          class="fa-solid fa-chart-line text-4xl text-sonja-akz"
        />
        <i v-else class="fa-solid fa-chart-line text-4xl" />
      </button>
    </div>

    <div class="flex-grow">
      <button
        @click="show.showRouter = 'workoutdetail'"
        class="text-lg border-sonja-bg pt-2 pb-10 w-full"
      >
        <i
          v-if="show.showRouter === 'workoutdetail'"
          class="fa-solid fa-home text-4xl text-sonja-akz"
        />
        <i v-else class="fa-solid fa-home text-4xl" />
      </button>
    </div>

    <div class="flex-grow">
      <button
        @click="show.showRouter = 'equiplist'"
        class="text-lg border-sonja-bg pt-2 pb-10 w-full"
      >
        <i
          v-if="show.showRouter === 'equiplist'"
          class="fa-solid fa-dumbbell text-4xl text-sonja-akz"
        />
        <i v-else class="fa-solid fa-dumbbell text-4xl" />
      </button>
    </div>

    <div class="flex-grow">
      <button
        @click="show.showRouter = 'workouts'"
        class="text-lg border-sonja-bg pt-2 pb-10 w-full"
      >
        <i
          v-if="show.showRouter === 'workouts'"
          class="fa-solid fa-calendar text-4xl text-sonja-akz"
        ></i>
        <i v-else class="fa-solid fa-calendar text-4xl"></i>
      </button>
    </div>
  </nav>
</template>
