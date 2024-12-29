<script setup lang="ts">
import { computed, ref } from "vue";
import Filter from "../Filter/Filter.vue";
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import FilterWrapper from "../Filter/FilterWrapper.vue";
import NewExercise from "../Dialogs/NewExercise.vue";
import FilterExercises from "../Filter/FilterExercises.vue";
import UpdateExercise from "./UpdateExercise.vue";

defineProps<{
  categories: CategoryType[];
  users: UserType;
  workout: WorkoutType | undefined;
}>();

const filter = ref<number[]>([]);
const weFilterStore = useWorkoutExerciseFilterStore();
const routerStore = useRouterStore();
const showDialogCategory = ref<boolean>(false);
const showDialogExercise = ref<boolean>(false);
const searchFilter = ref<string>("");

const deleteExerciseMutation = useDeleteExercise();
const showConfirmDeleteExercise = ref<boolean>(false);

const exerciseToDelete = ref<number>();
const deleteExercise = (id: number) => {
  deleteExerciseMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteExercise.value = false),
  });
};

const { data: exerciseStats } = useExerciseStats();

const filteredExercises = computed(() => {
  return exerciseStats.value?.filter((ex) => {
    const matchesCategoryFilter =
      filter.value.length === 0 ||
      ex.categories.some((category) => filter.value.includes(category.id));

    const matchesSearchFilter = true;
    searchFilter.value === "" ||
      ex.exercise_name
        .toLowerCase()
        .includes(searchFilter.value.toLowerCase()) ||
      ex.categories.some((category) =>
        category.name.toLowerCase().includes(searchFilter.value.toLowerCase()),
      );

    return matchesCategoryFilter && matchesSearchFilter;
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

const labelId = `input-${Math.random().toString(36).slice(2, 9)}`;

const filterWrapperComponent = ref<InstanceType<typeof Filter> | null>(null);
const updateExerciseRef = ref<InstanceType<typeof UpdateExercise> | null>(null);
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

    <FilterWrapper ref="filterWrapperComponent">
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
    </FilterWrapper>
    <!-- Update Exercise -->
    <UpdateExercise
      ref="updateExerciseRef"
      :categories="categories"
    />
    <!-- Exercise List -->
    <div
      class="no-scrollbar flex snap-y snap-mandatory flex-col overflow-y-scroll bg-sonja-bg"
    >
      <div v-for="exercise in exerciseList" class="p-1">
        <div
          @click="
            updateExerciseRef?.setForm({
              exercise_name: exercise[0].exercise_name,
              exercise_id: exercise[0].exercise_id,
              categories: exercise[0].categories.map((c) => c.id),
              info: exercise[0].info,
              type: exercise[0].type,
              metric: exercise[0].metric,
            });
            updateExerciseRef?.open();
          "
          class="flex cursor-pointer gap-1 overflow-x-scroll whitespace-nowrap text-2xl font-bold sm:overflow-x-auto"
        >
          <div class="flex">
            {{ exercise[0].exercise_name }}
            [
            <div v-for="c in exercise[0].categories">{{ c.name }},</div>
            ]
          </div>
          <i
            v-if="exercise[0].type === 'Machine'"
            class="fa-solid fa-cable-car"
          />
          <i
            v-else-if="exercise[0].type === 'Bodyweight'"
            class="fa-solid fa-child-reaching"
          />
          <i
            v-else-if="exercise[0].type === 'Dumbbell'"
            class="fa-solid fa-dumbbell"
          />
          <i v-if="exercise[0].metric === 'Time'" class="fa-solid fa-clock" />
          <i
            v-else-if="exercise[0].metric === 'Weight'"
            class="fa-solid fa-weight-hanging"
          />
          <button
            class="ml-2"
            @click.stop="
              weFilterStore.addId(exercise[0].exercise_id);
              routerStore.route = 'workoutexercises';
            "
          >
            <i class="fa-solid fa-chart-line text-sonja-akz" />
          </button>
          <!-- Delete exercise -->
          <button
            class="ml-2"
            @click.stop="
              exerciseToDelete = Number(exercise[0].exercise_id);
              showConfirmDeleteExercise = true;
            "
          >
            <i class="fa-solid fa-close text-red-800" />
          </button>
        </div>
        <div v-for="user in exercise.slice(1)" class="flex gap-2">
          <div v-if="user.user_name" class="flex gap-2">
            <div v-if="user.user_name">{{ user.user_name }}:</div>
            <div v-if="user.max_weight">PB {{ user.max_weight }}</div>
            <div v-else="user.max_weight">PB TBD</div>
            <div v-if="user.last_weight">Last {{ user.last_weight }}</div>
            <div v-else="user.last_weight">Last TBD</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Confirm Delete Exercise -->
    <Confirm
      v-model:isOpen="showConfirmDeleteExercise"
      @yes="deleteExercise(Number(exerciseToDelete))"
    />
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
