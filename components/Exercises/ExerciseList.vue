<script setup lang="ts">
import { computed, ref } from "vue";
import Filter from "../Filter/Filter.vue";
import Dialog from "../Dialogs/Dialog.vue";
import FilterWrapper from "../Filter/FilterWrapper.vue";
import NewExercise from "../Dialogs/NewExercise.vue";
import FilterExercises from "../Filter/FilterExercises.vue";
import Exercise from "./Exercise.vue";
import UserSelectionHeader from "../Header/UserSelectionHeader.vue";

defineProps<{
  categories: CategoryType[];
  users: UserType[];
  workout: WorkoutType | undefined;
}>();

const filter = ref<number[]>([]);
const routerStore = useRouterStore();
const showDialogCategory = ref<boolean>(false);
const showDialogExercise = ref<boolean>(false);
const searchFilter = ref<string>("");

const loggedStore = useLoggedStore();

const { data: exerciseStats } = useExerciseStats();

const filteredExercises = computed(() => {
  return exerciseStats.value?.filter((ex) => {
    const matchesCategoryFilter =
      filter.value.length === 0 ||
      ex.categories.some((category) => filter.value.includes(category.id));

    const matchesSearchFilter =
      searchFilter.value === "" ||
      ex.exercise_name
        .toLowerCase()
        .includes(searchFilter.value.toLowerCase()) ||
      ex.categories.some((category) =>
        category.name.toLowerCase().includes(searchFilter.value.toLowerCase()),
      );

    let userFilter;
    if (userSelectionRef.value) {
      userFilter =
        userSelectionRef.value.selected === 0
          ? true
          : ex.user_id === userSelectionRef.value.selected;
    } else {
      userFilter = true;
    }

    return matchesCategoryFilter && matchesSearchFilter && userFilter;
  });
});

const exerciseList = computed<ExerciseStatsType[][] | undefined>(() => {
  if (filteredExercises.value) {
    const groupedData = filteredExercises.value?.reduce(
      (acc: { [key: number]: any[] }, curr) => {
        const exerciseId = curr.exercise_id;
        const userId = curr.user_id;

        // Wenn das exercise_id noch nicht existiert, füge es hinzu
        if (!acc[exerciseId]) {
          acc[exerciseId] = [];
        }

        // Prüfen, ob das erste Objekt bereits für dieses exercise_id existiert
        const firstEntry = acc[exerciseId][0];

        if (!firstEntry) {
          acc[exerciseId].push({
            exercise_name: curr.exercise_name,
            exercise_id: curr.exercise_id,
            categories: curr.categories,
            info: curr.info,
            type: curr.type,
            metric: curr.metric,
          });
        }

        acc[exerciseId].push({
          user_id: userId,
          max_weight: curr.max_weight,
          last_weight: curr.last_weight,
          user_name: curr.user_name,
        });

        return acc;
      },
      {},
    );

    // Umwandeln der Ergebnisse in ein Array von Arrays und nach Namen sortieren
    return Object.values(groupedData).sort((a: any, b: any) => {
      // TODO: variable sorting
      return a[0].exercise_name.localeCompare(b[0].exercise_name);
    });
  }
});

const filterWrapperComponent = ref<InstanceType<typeof Filter> | null>(null);
const userSelectionRef = ref<InstanceType<typeof UserSelectionHeader>>();

onMounted(() => {
  if (userSelectionRef.value) {
    userSelectionRef.value.selected = loggedStore.logged.user.id ?? 0;
  }
});
</script>

<template>
  <div class="relativ">
    <Header
      @left="routerStore.route = 'categorylist'"
      @right="filterWrapperComponent?.toggle"
      leftIcon="fa-solid fa-repeat"
      rightIcon="fa-solid fa-filter"
    >
      Exercise List
    </Header>

    <FilterWrapper ref="filterWrapperComponent" open>
      <div class="flex flex-col">
        <div class="flex max-w-full justify-evenly">
          <Filter
            :data="
              categories.map((category: CategoryType) => ({
                id: category.id,
                name: category.name,
              }))
            "
            v-model="filter"
          />
          <FilterExercises v-model="searchFilter" />
          <!-- New Exercise -->
          <Dialog
            :isOpen="showDialogExercise"
            @close="
              showDialogExercise = false;
              showDialogCategory = false;
            "
          >
            <template #trigger>
              <button
                class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
                @click="showDialogExercise = true"
              >
                <i class="fa-solid fa-plus" />
              </button>
            </template>
            <NewExercise
              @close="
                showDialogExercise = false;
                showDialogCategory = false;
              "
            />
          </Dialog>
        </div>
        <UserSelectionHeader ref="userSelectionRef" class="mt-1" />
      </div>
    </FilterWrapper>

    <!-- Exercise List -->
    <div
      class="no-scrollbar flex snap-y snap-mandatory flex-col overflow-y-scroll bg-sonja-bg pt-4"
    >
      <div v-for="exercise in exerciseList" class="p-1 py-3">
        <Exercise :exercise :categories />
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>
