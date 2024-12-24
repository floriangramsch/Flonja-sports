<script setup lang="ts">
import BetterExerciseSelection from './BetterExerciseSelection.vue';

const { data: plans } = usePlan();
const selectedPlan = ref<Plan>();
const { data: plan } = useGetPlan(
  computed(() => selectedPlan.value?.id),
);
const addPlanMutation = useAddPlan();
const addPlan = () => {
  if (newPlanForm.value.name) {
    addPlanMutation.mutate(
      {
        name: newPlanForm.value.name,
        day: newPlanForm.value.day,
      },
      { onSuccess: () => (newPlanDialog.value = false) },
    );
  }
};
const PlanToDelete = ref<number>();
const confirmDelete = ref<boolean>(false);
const deleteMutation = useDeletePlan();
const deletePlan = () => {
  if (PlanToDelete.value) {
    deleteMutation.mutate(PlanToDelete.value, {
      onSuccess: () => (confirmDelete.value = false),
    });
  }
};

const newPlanDialog = ref<boolean>(false);
const newPlanForm = ref({
  name: undefined,
  day: undefined,
});

// detail
const { data: exercises } = useExercises();
const { data: categories } = useCategories();

const newExExerciseDialog = ref<boolean>(false);
const newExDialog = ref<boolean>(false);
const newExId = ref<number>();
const newExSets = ref<number>();
const newExReps = ref<number>();
const toDeleteExId = ref<number>();

const confirmDeleteEx = ref<boolean>(false);
const deleteExMutation = useDeletePlanExercise();
const deleteEx = () => {
  if (toDeleteExId.value) {
    deleteExMutation.mutate(toDeleteExId.value, {
      onSuccess: () => {
        confirmDeleteEx.value = false;
        toDeleteExId.value = undefined;
      },
    });
  }
};

const newExMutation = useAddPlanExercise();
const newEx = () => {
  if (
    selectedPlan.value?.id &&
    newExId.value &&
    newExSets.value &&
    newExReps.value
  ) {
    newExMutation.mutate(
      {
        plan_id: selectedPlan.value.id,
        exercise_id: newExId.value,
        sets: newExSets.value,
        reps: newExReps.value,
      },
      {
        onSuccess: () => {
          newExSets.value = undefined;
          newExReps.value = undefined;
          newExExerciseDialog.value = false;
          newExDialog.value = false;
          newExId.value = undefined;
        },
      },
    );
  }
};

watch(newExId, (newValue) => {
  if (newValue) {
    newExDialog.value = true;
  }
});
</script>
<template>
  <div v-if="!plan && !newExExerciseDialog">
    <div
      class="cursor-pointer p-1"
      @click="selectedPlan = plan"
      v-for="plan in plans"
    >
      {{ plan.name }}
      <button
        class="ml-2"
        @click.stop="
          PlanToDelete = Number(plan.id);
          confirmDelete = true;
        "
      >
        <i class="fa-solid fa-close text-red-800" />
      </button>
    </div>

    <DialogsConfirm
      v-model:is-open="confirmDelete"
      @no="newPlanDialog = false"
      @yes="deletePlan"
    />

    <button
      class="mb-2 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
      @click="newPlanDialog = true"
    >
      <i class="fa-solid fa-plus" />
    </button>
    <DialogsDialog :is-open="newPlanDialog" @close="newPlanDialog = false">
      <UiInputsTextinput label="Name" v-model="newPlanForm.name" />
      <UiButtonsButton @action="addPlan" class="mt-2"
        >New Plan</UiButtonsButton
      >
    </DialogsDialog>
  </div>
  <div v-else>
    <div v-if="!newExExerciseDialog && plan">
      <button
        class="mb-2 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="selectedPlan = undefined"
      >
        <i class="fa-solid fa-arrow-left" />
      </button>
      {{ selectedPlan?.name }}
      <div v-for="plan in plan" class="flex flex-col p-1" :key="plan.id">
        <div v-if="plan.name">
          {{ plan.name }}
          <button
            class="ml-2"
            @click.stop="
              toDeleteExId = Number(plan.id);
              confirmDeleteEx = true;
            "
          >
            <i class="fa-solid fa-close text-red-800" />
          </button>
        </div>
        <div v-if="plan.sets && plan.reps">
          {{ plan.sets }} Sets {{ plan.reps }} Reps
        </div>
      </div>

      <button
        class="mb-2 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="newExExerciseDialog = true"
      >
        <i class="fa-solid fa-plus" />
      </button>
    </div>
    <BetterExerciseSelection
      v-if="newExExerciseDialog && categories && exercises"
      :categories="categories"
      :exercises="exercises"
      v-model:result="newExId"
      @close="newExExerciseDialog = false"
    />

    <DialogsDialog :is-open="newExDialog" @close="newExDialog = false">
      <div class="flex flex-col gap-1">
        <UiInputsTextinput label="Sets" v-model="newExSets" />
        <UiInputsTextinput label="Reps" v-model="newExReps" />
      </div>
      <UiButtonsButton @action="newEx" class="mt-2">New Ex</UiButtonsButton>
    </DialogsDialog>

    <DialogsConfirm
      v-model:is-open="confirmDeleteEx"
      @no="confirmDeleteEx = false"
      @yes="deleteEx"
    />
  </div>
</template>
