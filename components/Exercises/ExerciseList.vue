<script setup lang="ts">
import { computed, ref } from "vue";
import Filter from "../Filter/Filter.vue";
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import Select from "../ui/select/Select.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import FilterWrapper from "../Filter/FilterWrapper.vue";
import NewExercise from "../Dialogs/NewExercise.vue";
import FilterExercises from "../Filter/FilterExercises.vue";
import MultiSelect from "../ui/select/MultiSelect.vue";

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
const showDialogUpdateExercise = ref<boolean>(false);
const searchFilter = ref<string>("");

const deleteExerciseMutation = useDeleteExercise();
const showConfirmDeleteExercise = ref<boolean>(false);


const exerciseForm = ref<{
  exercise_name?: string;
  exercise_id?: number;
  categories: number[];
  info?: string;
  type?: ExerciseArtType;
  metric?: ExerciseMetricType;
}>({
  exercise_name: undefined,
  exercise_id: undefined,
  categories: [],
  info: undefined,
  type: undefined,
  metric: undefined,
});

const updateExerciseMutation = useUpdateExercise();
const updateExercise = () => {
  if (exerciseForm.value && exerciseForm.value.exercise_id && exerciseForm.value.categories) {
    updateExerciseMutation.mutate(
      {
        updatedData: `name = '${exerciseForm.value.exercise_name}', info = '${exerciseForm.value.info}', type = '${exerciseForm.value.type}', metric = '${exerciseForm.value.metric}'`,
        exercise_id: exerciseForm.value.exercise_id,
        categorieIds: exerciseForm.value.categories,
      },
      {
        onSuccess: () => {
          showDialogUpdateExercise.value = false;
          exerciseForm.value = {
            exercise_name: undefined,
            exercise_id: undefined,
            categories: [],
            info: undefined,
            type: undefined,
            metric: undefined,
          };
        },
      },
    );
  }
};

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
    <Dialog
      :isOpen="showDialogUpdateExercise"
      @close="
        showDialogExercise = false;
        showDialogCategory = false;
        showDialogUpdateExercise = false;
      "
    >
      <div class="my-2 flex flex-col gap-4">
        <Textinput
          v-model="exerciseForm.exercise_name"
          label="Exercise Name"
          focus
        />

        <MultiSelect
          v-model="exerciseForm.categories"
          name="Category..."
          :options="
            categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))
          "
        />

        <Select
          class="w-full"
          v-model="exerciseForm.type"
          default="Type..."
          :options="[
            { value: 'Bodyweight', label: 'Bodyweight' },
            { value: 'Machine', label: 'Machine' },
            { value: 'Dumbbell', label: 'Dumbbell' },
          ]"
        />

        <Select
          class="w-full"
          v-model="exerciseForm.metric"
          default="Metric..."
          :options="[
            { value: 'Time', label: 'Time' },
            { value: 'Weight', label: 'Weight' },
          ]"
        />

        <!-- Info -->
        <div class="relative">
          <textarea
            class="peer h-48 w-48 rounded border-2 border-sonja-text bg-sonja-text p-2 text-sonja-akz2 shadow focus:outline-none focus:ring-2 focus:ring-sonja-akz"
            v-model="exerciseForm.info"
            ref="infoRef"
            placeholder=" "
          />
          <label
            :for="labelId"
            class="absolute left-2 -translate-y-1/2 rounded bg-sonja-akz p-[2px] text-xs text-sonja-text shadow transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:bg-sonja-text peer-placeholder-shown:text-xl peer-placeholder-shown:text-sonja-akz2 peer-focus:left-2 peer-focus:top-0 peer-focus:bg-sonja-akz peer-focus:p-[2px] peer-focus:text-xs peer-focus:text-sonja-text"
          >
            Info
          </label>
        </div>
      </div>
      <Button @action="updateExercise">Update</Button>
    </Dialog>
    <!-- Exercise List -->
    <div
      class="no-scrollbar flex snap-y snap-mandatory flex-col overflow-y-scroll bg-sonja-bg"
    >
      <div v-for="exercise in exerciseList" class="p-1">
        <div
          @click="
            {
              exerciseForm = {
                exercise_name: exercise[0].exercise_name,
                exercise_id: exercise[0].exercise_id,
                categories: exercise[0].categories.map(c => c.id),
                info: exercise[0].info,
                type: exercise[0].type,
                metric: exercise[0].metric,
              };
              showDialogUpdateExercise = true;
            }
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
