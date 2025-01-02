<script setup lang="ts">
defineProps<{
  wexercise: SetHelperType;
  showLegacy: boolean;
}>();

const showChart = ref<boolean>(false);
</script>

<template>
  <div class="cursor-pointer font-bold" @click="showChart = !showChart">
    {{ wexercise.exercise_name }}
  </div>
  <transition name="expand">
    <div v-show="showChart" class="overflow-hidden">
      <div v-for="user in wexercise.users" class="flex flex-wrap">
        <ChartsExerciseChart :user="user.user_name" :data="user.sets" />
        <div v-if="showLegacy" v-for="(set, index) in user.sets" class="flex">
          <div class="mx-2 flex">
            <div v-if="set.reps">{{ set.reps }}</div>
            <div>@{{ set.weight }}</div>
          </div>
          <i
            v-if="index !== user.sets.length - 1"
            class="fa-solid fa-arrow-right"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px; /* Set a high value to ensure it expands fully */
  opacity: 1;
}
</style>
