<script setup lang="ts">
import { computed } from "vue";
import Filter from "../Filter/Filter.vue";
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import WorkoutExercise from "./WorkoutExercise.vue";

const exercises = defineModel<ExerciseType[]>();

const { data: sets } = useGetSets();

const filterStore = useWorkoutExerciseFilterStore();

const filtered = computed(() => {
  return sets.value?.filter(
    (exercise) =>
      filterStore.ids.length === 0 ||
      filterStore.ids.includes(Number(exercise.exercise_id)),
  );
});

const filterWrapperComponent = ref<InstanceType<typeof Filter> | null>(null);

const showLegacy = ref<boolean>(false);
</script>

<template>
  <SlideTransition>
    <div class="bg-sonja-bg text-sonja-text">
      <Header
        @right="filterWrapperComponent?.toggle"
        rightIcon="fa-solid fa-filter"
      >
        Exercises Done
      </Header>

      <FilterWrapper ref="filterWrapperComponent">
        <Filter
          :data="
            exercises?.map((exercise: ExerciseType) => ({
              id: exercise.exercise_id,
              name: exercise.exercise_name,
            }))
          "
          v-model="filterStore.ids"
        />
        <button
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="showLegacy = !showLegacy"
        >
          <i class="fa-solid fa-barcode" />
        </button>
      </FilterWrapper>

      <!-- Workout_Exercise List -->
      <div
        v-for="workout_exercise in filtered"
        class="p-1"
        :key="workout_exercise.exercise_id"
      >
        <WorkoutExercise :wexercise="workout_exercise" :showLegacy />
      </div>
    </div>
  </SlideTransition>
</template>
