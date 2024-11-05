<script setup lang="ts">
import useExercisesByWorkout from "~/composables/Exercises/useExercisesByWorkout";

const props = defineProps<{
  equips: EquipType;
  workout: LoggedWorkout;
}>();

const show = defineModel<any>();

const { data: exercises } = useExercisesByWorkout(props.workout.id);

const exToShow = ref();
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="!exToShow" class="absolute inset-0">
      <div
        v-for="ex in exercises"
        class="border-b border-sonja-bg-darker flex justify-center py-2 cursor-pointer"
        @click="exToShow = ex"
      >
        {{ ex.name }}
      </div>
      <button
        class="w-full bg-sonja-bg-darker flex justify-center"
        @click="() => (show.showRouter = 'equipselection')"
      >
        <i class="fa-solid fa-plus text-3xl" />
      </button>
    </div>
  </Transition>
  <Transition name="fade" mode="out-in">
    <EquipDetail
      v-if="exToShow"
      :exercise="exToShow"
      @close="exToShow = undefined"
    />
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
