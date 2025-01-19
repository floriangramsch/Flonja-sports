<script setup lang="ts">
import { computed } from "vue";
import Filter from "../Filter/Filter.vue";
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import WorkoutExercise from "./WorkoutExercise.vue";
import type FilterWrapper from "../Filter/FilterWrapper.vue";
import UserSelectionHeader from "../Header/UserSelectionHeader.vue";

const exercises = defineModel<ExerciseType[]>();

const { data: sets } = useGetSets();

const filterStore = useWorkoutExerciseFilterStore();
const loggedStore = useLoggedStore();
const searchFilter = ref<string | undefined>("");

const filtered = computed(() => {
  return sets.value?.filter((ex) => {
    const matchesIdFilter =
      filterStore.ids.length === 0 ||
      filterStore.ids.includes(Number(ex.exercise_id));

    const matchesSearchFilter =
      searchFilter.value === "" ||
      ex.exercise_name
        .toLowerCase()
        .includes((searchFilter.value ?? "").toLowerCase());

    let userFilter;
    if (userSelectionRef.value) {
      userFilter =
        userSelectionRef.value.selected === 0
          ? true
          : ex.users.some(
              (user) => user.user_id === userSelectionRef.value?.selected,
            );
    } else {
      userFilter = true;
    }
    return matchesIdFilter && matchesSearchFilter && userFilter;
    // return matchesIdFilter && matchesSearchFilter;
  });
});

const filterWrapperComponent = ref<InstanceType<typeof FilterWrapper> | null>(
  null,
);

const showLegacy = ref<boolean>(false);

const userSelectionRef = ref<InstanceType<typeof UserSelectionHeader>>();

onMounted(() => {
  if (userSelectionRef.value) {
    userSelectionRef.value.selected = loggedStore.logged.user.id ?? 0;
  }
});
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
        <div class="flex flex-col">
          <div class="flex max-w-full justify-evenly">
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
          </div>
          <UserSelectionHeader ref="userSelectionRef" class="mt-1" />
        </div>
      </FilterWrapper>

      <!-- Workout_Exercise List -->
      <div
        v-for="workout_exercise in filtered"
        class="p-1"
        :key="workout_exercise.exercise_id"
      >
        <WorkoutExercise
          v-if="userSelectionRef"
          :wexercise="workout_exercise"
          :showLegacy
          :selectedUserId="userSelectionRef.selected"
        />
      </div>
    </div>
  </SlideTransition>
</template>
