<script setup lang="ts">
import PlanList from "./PlanList.vue";

const props = defineProps<{
  workout: WorkoutType | undefined;
}>();

const logged = useLoggedStore()

const { data: plans } = useUserPlans(computed(() => logged.logged.user.id));
const selectedPlan = usePlanStore()
const { data: plan } = useGetPlan(computed(() => selectedPlan.plan?.id));
const addPlanMutation = useAddPlan();
const addPlan = () => {
  if (newPlanForm.value.name && logged.logged.user.id) {
    addPlanMutation.mutate(
      {
        name: newPlanForm.value.name,
        day: newPlanForm.value.day,
        user_id: logged.logged.user.id
      },
      {
        onSuccess: () => {
          newPlanDialog.value = false;
          newPlanForm.value.name = undefined;
        },
      },
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

const planListRef = ref<InstanceType<typeof PlanList> | null>(null);

const getRightIcon = () => {
  if (selectedPlan.plan && planListRef.value) {
    if (planListRef.value.isOrdered && props.workout) {
      return "fa-solid fa-check";
    } else if (!planListRef.value.isOrdered) {
      return "fa-solid fa-refresh";
    }
  }
  return undefined;
};

const getRightFunction = () => {
  if (selectedPlan.plan && planListRef.value) {
    if (planListRef.value.isOrdered && props.workout) {
      return planListRef?.value?.apply();
    } else if (!planListRef.value.isOrdered) {
      return planListRef?.value?.update();
    }
  }
  return undefined;
};
</script>
<template>
  <Header
    @left="selectedPlan.plan?.name ? (selectedPlan.reset()) : undefined"
    @right="getRightFunction"
    :leftIcon="selectedPlan.plan?.name ? 'fa-solid fa-arrow-left' : undefined"
    :rightIcon="getRightIcon()"
  >
    {{ selectedPlan.plan?.name ? selectedPlan.plan.name : "Workout Plans" }}
  </Header>
  <!-- {{ plans[0] }} -->
  <div v-if="!plan">
    <div
      class="flex cursor-pointer items-center justify-center rounded-full border-b border-sonja-bg-darker p-2"
      @click="selectedPlan.setPlan(plan)"
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
      <UiInputsTextinput label="Name" v-model="newPlanForm.name" focus />
      <UiButtonsButton @action="addPlan" class="mt-2">New Plan</UiButtonsButton>
    </DialogsDialog>
  </div>
  <PlanList
    v-if="plan"
    ref="planListRef"
    :plan="plan"
    :workout="workout"
  />
</template>
