<template>
  <div
    @click.stop="showUser = !showUser"
    class="flex cursor-pointer gap-1 overflow-x-scroll whitespace-nowrap text-2xl font-bold sm:overflow-x-auto"
  >
    <div class="flex">
      {{ exercise[0].exercise_name }}
    </div>
    <i v-if="exercise[0].type === 'Machine'" class="fa-solid fa-cable-car" />
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
  </div>
  <div class="relative">
    <div class="absolute -top-[50px] right-auto z-0 flex gap-1">
      <UiChip
        v-for="c in exercise[0].categories"
        :content="c.name"
        :type="c.type"
      />
    </div>
    <transition name="expand">
      <div
        v-show="showUser"
        class="overflow-hidden border-l-4 border-sonja-text pl-2"
      >
        <!-- Chart exercise -->
        <button
          @click.stop="
            weFilterStore.addId(exercise[0].exercise_id);
            routerStore.route = 'workoutexercises';
          "
        >
          <i class="fa-solid fa-chart-line text-sonja-akz" />
        </button>

        <!-- Edit exercise -->
        <button
          class="ml-2"
          @click.stop="
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
        >
          <i class="fa-solid fa-edit" />
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
        <div v-for="user in exercise.slice(1)" class="flex gap-2">
          <div v-if="user.user_name" class="flex gap-2">
            <div v-if="user.user_name">{{ user.user_name }}:</div>
            <div v-if="user.max_weight">PB {{ user.max_weight }}</div>
            <div v-else="user.max_weight">PB TBD</div>
            <div v-if="user.last_weight">Last {{ user.last_weight }}</div>
            <div v-else="user.last_weight">Last TBD</div>
          </div>
          <div v-else>No data yet</div>
        </div>
      </div>
    </transition>
  </div>

  <!-- Update Exercise -->
  <UpdateExercise ref="updateExerciseRef" :categories="categories" />

  <!-- Confirm Delete Exercise -->
  <Confirm
    v-model:isOpen="showConfirmDeleteExercise"
    @yes="deleteExercise(Number(exerciseToDelete))"
  />
</template>

<script setup lang="ts">
import UpdateExercise from "./UpdateExercise.vue";
import Confirm from "../Dialogs/Confirm.vue";

defineProps<{
  exercise: ExerciseStatsType[];
  categories: CategoryType[];
}>();

const weFilterStore = useWorkoutExerciseFilterStore();
const routerStore = useRouterStore();

const updateExerciseRef = ref<InstanceType<typeof UpdateExercise> | null>(null);

const showUser = ref<boolean>(false);

const deleteExerciseMutation = useDeleteExercise();
const showConfirmDeleteExercise = ref<boolean>(false);

const exerciseToDelete = ref<number>();
const deleteExercise = (id: number) => {
  deleteExerciseMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteExercise.value = false),
  });
};
</script>

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
