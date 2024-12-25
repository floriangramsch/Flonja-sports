<script setup lang="ts">
import BetterExerciseSelection from "./BetterExerciseSelection.vue";

const { data: plans } = usePlan();
const selectedPlan = ref<Plan>();
const { data: plan } = useGetPlan(computed(() => selectedPlan.value?.id));
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
      class="flex cursor-pointer items-center justify-center rounded-full border-b border-sonja-bg-darker p-2"
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
      class="flex w-full justify-center rounded-full rounded-t bg-sonja-bg-darker pb-2 pt-3"
      @click="newPlanDialog = true"
    >
      <i class="fa-solid fa-plus" />
    </button>
    <DialogsDialog :is-open="newPlanDialog" @close="newPlanDialog = false">
      <UiInputsTextinput label="Name" v-model="newPlanForm.name" />
      <UiButtonsButton @action="addPlan" class="mt-2">New Plan</UiButtonsButton>
    </DialogsDialog>
  </div>
  <div v-else>
    <div v-if="!newExExerciseDialog && plan">
      <div class="flex w-full justify-evenly px-4 pb-4">
        <button
          class="absolute left-16 mb-2 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="selectedPlan = undefined"
        >
          <i class="fa-solid fa-arrow-left" />
        </button>
        <div class="text-center text-4xl font-bold">
          {{ selectedPlan?.name }}
        </div>
      </div>
      <div v-for="ex in plan" class="p-1" :key="ex.id">
        <div v-if="ex.name" class="grid grid-cols-2">
          <div>
            {{ ex.name }}
            <button
              class="ml-2"
              @click.stop="
                toDeleteExId = Number(ex.id);
                confirmDeleteEx = true;
              "
            >
              <i class="fa-solid fa-close text-red-800" />
            </button>
          </div>
          <div class="ml-2" v-if="ex.sets && ex.reps">
            {{ ex.sets }}x{{ ex.reps }}{{ ex.metric === "Time" ? "s" : "kg" }}
          </div>
        </div>
      </div>

      <button
        class="flex w-full justify-center rounded-full rounded-t bg-sonja-bg-darker pb-2 pt-3"
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
      <div class="flex gap-1">
        <UiNumberInput
            v-model:modelValue="newExReps"
            label="Reps"
          />
          <UiNumberInput
            v-model:modelValue="newExSets"
            label="Metric"
          />
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
