<script setup lang="ts">
import { computed } from "vue";
import Filter from "../Filter/Filter.vue";
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import WorkoutExercise from "./WorkoutExercise.vue";
import type FilterWrapper from "../Filter/FilterWrapper.vue";

const props = defineProps<{
  categories?: CategoryType[];
}>();
const exercises = defineModel<ExerciseType[]>();

const { data: sets } = useGetSets();

const filterStore = useWorkoutExerciseFilterStore();
const searchFilter = ref<string>("");

const filtered = computed(() => {
  return sets.value?.filter((ex) => {
    const matchesIdFilter =
      filterStore.ids.length === 0 ||
      filterStore.ids.includes(Number(ex.exercise_id));

    const matchesSearchFilter =
      searchFilter.value === "" ||
      ex.exercise_name.toLowerCase().includes(searchFilter.value.toLowerCase());
    return matchesIdFilter && matchesSearchFilter;
  });
});

const filterWrapperComponent = ref<InstanceType<typeof FilterWrapper> | null>(
  null,
);

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

      <FilterWrapper ref="filterWrapperComponent" open>
        <Filter
          :data="
            exercises?.map((exercise: ExerciseType) => ({
              id: exercise.exercise_id,
              name: exercise.exercise_name,
            }))
          "
          v-model="filterStore.ids"
        />
        <FilterExercises v-model="searchFilter" />
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
