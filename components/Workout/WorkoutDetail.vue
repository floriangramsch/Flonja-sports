<script setup lang="ts">
import useExercisesByWorkout from "~/composables/Exercises/useExercisesByWorkout";
import SlideTransition from "../ui/transitions/SlideTransition.vue";

const props = defineProps<{
  equips: EquipType;
  workout: LoggedWorkout;
}>();

const show = defineModel<any>();

const { data: exercises } = useExercisesByWorkout(props.workout.id);

const exToShow = ref();
</script>

<template>
  <SlideTransition>
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
  </SlideTransition>
  <SlideTransition>
    <WorkoutEquipDetail
      v-if="exToShow"
      :exercise="exToShow"
      @close="exToShow = undefined"
    />
  </SlideTransition>
</template>
