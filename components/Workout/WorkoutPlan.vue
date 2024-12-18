<script setup lang="ts">
import BetterEquipSelection from "./BetterEquipSelection.vue";

const { data: workoutplans } = useWorkoutPlan();
const selectedWorkoutPlan = ref<WorkoutPlan>();
const { data: workoutPlan } = useGetWorkoutPlan(
  computed(() => selectedWorkoutPlan.value?.id),
);
const addWorkoutPlanMutation = useAddWorkoutPlan();
const addWorkoutPlan = () => {
  if (newPlanForm.value.name) {
    addWorkoutPlanMutation.mutate(
      {
        name: newPlanForm.value.name,
        day: newPlanForm.value.day,
      },
      { onSuccess: () => (newPlanDialog.value = false) },
    );
  }
};
const workoutPlanToDelete = ref<number>();
const confirmDelete = ref<boolean>(false);
const deleteMutation = useDeleteWorkoutPlan();
const deleteWorkoutPlan = () => {
  if (workoutPlanToDelete.value) {
    deleteMutation.mutate(workoutPlanToDelete.value, {
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
const { data: equips } = useEquips();
const { data: muscles } = useMuscles();

const newExEquipDialog = ref<boolean>(false);
const newExDialog = ref<boolean>(false);
const newExEquipId = ref<number>();
const newExEquipSets = ref<number>();
const newExEquipReps = ref<number>();
const toDeleteExId = ref<number>();

const confirmDeleteEx = ref<boolean>(false);
const deleteExMutation = useDeleteWorkoutPlanExercise();
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

const newExMutation = useAddWorkoutPlanExercise();
const newEx = () => {
  if (
    selectedWorkoutPlan.value?.id &&
    newExEquipId.value &&
    newExEquipSets.value &&
    newExEquipReps.value
  ) {
    newExMutation.mutate(
      {
        plan_id: selectedWorkoutPlan.value.id,
        equip_id: newExEquipId.value,
        sets: newExEquipSets.value,
        reps: newExEquipReps.value,
      },
      {
        onSuccess: () => {
          newExEquipSets.value = undefined;
          newExEquipReps.value = undefined;
          newExEquipDialog.value = false;
          newExDialog.value = false;
          newExEquipId.value = undefined;
        },
      },
    );
  }
};

watch(newExEquipId, (newValue) => {
  if (newValue) {
    newExDialog.value = true;
  }
});
</script>
<template>
  <div v-if="!workoutPlan && !newExEquipDialog">
    <div
      class="cursor-pointer p-1"
      @click="selectedWorkoutPlan = plan"
      v-for="plan in workoutplans"
    >
      {{ plan.name }}
      <button
        class="ml-2"
        @click.stop="
          workoutPlanToDelete = Number(plan.id);
          confirmDelete = true;
        "
      >
        <i class="fa-solid fa-close text-red-800" />
      </button>
    </div>

    <DialogsConfirm
      v-model:is-open="confirmDelete"
      @no="newPlanDialog = false"
      @yes="deleteWorkoutPlan"
    />

    <button
      class="mb-2 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
      @click="newPlanDialog = true"
    >
      <i class="fa-solid fa-plus" />
    </button>
    <DialogsDialog :is-open="newPlanDialog" @close="newPlanDialog = false">
      <UiInputsTextinput label="Name" v-model="newPlanForm.name" />
      <UiButtonsButton @action="addWorkoutPlan" class="mt-2"
        >New Plan</UiButtonsButton
      >
    </DialogsDialog>
  </div>
  <div v-else>
    <div v-if="!newExEquipDialog && workoutPlan">
      <button
        class="mb-2 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="selectedWorkoutPlan = undefined"
      >
        <i class="fa-solid fa-arrow-left" />
      </button>
      {{ selectedWorkoutPlan?.name }}
      <div v-for="plan in workoutPlan" class="flex flex-col p-1" :key="plan.id">
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
        @click="newExEquipDialog = true"
      >
        <i class="fa-solid fa-plus" />
      </button>
    </div>
    <BetterEquipSelection
      v-if="newExEquipDialog && muscles && equips"
      :muscles="muscles"
      :equips="equips"
      v-model:result="newExEquipId"
      @close="newExEquipDialog = false"
    />

    <DialogsDialog :is-open="newExDialog" @close="newExDialog = false">
      <div class="flex flex-col gap-1">
        <UiInputsTextinput label="Sets" v-model="newExEquipSets" />
        <UiInputsTextinput label="Reps" v-model="newExEquipReps" />
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
