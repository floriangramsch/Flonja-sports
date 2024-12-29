<script setup lang="ts">
import { computed } from "vue";
import Filter from "../Filter/Filter.vue";
import SlideTransition from "../ui/transitions/SlideTransition.vue";

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
        <div class="font-bold">
          {{ workout_exercise.exercise_name }}
        </div>
        <div v-for="user in workout_exercise.users" class="flex flex-wrap">
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
    </div>
  </SlideTransition>
</template>
