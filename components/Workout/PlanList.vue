<script setup lang="ts">
import useAddWorkoutExercise from "~/composables/useWorkoutExercise";
import BetterExerciseSelection from "./BetterExerciseSelection.vue";
import UpdatePlanExercise from "../Plan/UpdatePlanExercise.vue";

const props = defineProps<{
  plan: PlanExercise[];
  workout: WorkoutType | undefined;
}>();

defineEmits<{
  (e: "delete"): void;
}>();

const selectedPlan = usePlanStore();

const routerStore = useRouterStore();
const updateOrderMutation = useUpdateOrderPlanExercise();

const { data: exercises } = useExercises();
const { data: categories } = useCategories();

const newExExerciseDialog = ref<boolean>(false);
const newExDialog = ref<boolean>(false);
const newExId = ref<number>();
const newExSets = ref<number>();
const newExReps = ref<number>();
const newExRepsTo = ref<number>();
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
    selectedPlan.plan?.id &&
    newExId.value &&
    newExSets.value &&
    newExReps.value &&
    newExRepsTo.value &&
    props.plan
  ) {
    newExMutation.mutate(
      {
        plan_id: selectedPlan.plan.id,
        exercise_id: newExId.value,
        sets: newExSets.value,
        reps: newExReps.value,
        reps_to: newExRepsTo.value,
        order: props.plan.length + 1,
      },
      {
        onSuccess: () => {
          newExSets.value = undefined;
          newExReps.value = undefined;
          newExRepsTo.value = undefined;
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

const mutation = useAddWorkoutExercise();
const addNewWorkoutExercise = (
  workoutId: number | undefined,
  exercise_id: number,
) => {
  if (workoutId) {
    mutation.mutate(
      {
        workout_id: workoutId,
        exercise_id: exercise_id,
      },
      {
        onSuccess: () => {
          routerStore.setRoute('workoutpage')
        },
        onError: (e) => console.error(e),
      },
    );
  }
};

const isDragging = ref(false);
const dragElement = ref<HTMLElement | null>(null);
const offsetX = ref(0);
const offsetY = ref(0);
const dragTimeout = ref<number | null>(null);

const pos = ref<number | undefined>(undefined);

const data = ref(props.plan);
const isOrdered = computed(() => {
  return data.value.every((item, index) => item.order === index + 1);
});

const startMoving = (e: MouseEvent | TouchEvent, element: HTMLElement) => {
  if ((e.target as HTMLElement).tagName === "I") return;
  dragTimeout.value = window.setTimeout(() => {
    isDragging.value = true;
    dragElement.value = element.closest(".draggable");

    document.body.style.overflow = "hidden";
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("scroll", preventDefault, { passive: false });

    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    offsetX.value = clientX - element.getBoundingClientRect().left;
    offsetY.value = clientY - element.getBoundingClientRect().top;

    // show line where the element can be put
    if (dragElement.value) {
      dragElement.value.style.visibility = "hidden";
      const belowId = document
        .elementFromPoint(clientX, clientY)
        ?.closest(".draggable")?.id;
      dragElement.value.style.visibility = "visible";
      pos.value = Number(belowId) || -1;
    }
  }, 300);
};

const moveElement = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !dragElement.value) return;
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

  // show line where the element can be put
  dragElement.value.style.visibility = "hidden";
  const belowId = document
    .elementFromPoint(clientX, clientY)
    ?.closest(".draggable")?.id;
  dragElement.value.style.visibility = "visible";
  pos.value = Number(belowId) || -1;

  dragElement.value.style.position = "absolute";
  // dragElement.value.style.left = `${clientX - offsetX.value}px`;
  dragElement.value.style.left = `0px`;
  dragElement.value.style.top = `${clientY - offsetY.value - 80}px`;
  dragElement.value.style.width = `100%`;
};

const stopMoving = (e: MouseEvent | TouchEvent) => {
  if (dragTimeout.value) {
    clearTimeout(dragTimeout.value);
    dragTimeout.value = null;
  }
  isDragging.value = false;
  document.body.style.overflow = "auto"; // activate scrolling
  pos.value = undefined;
  if (dragElement.value) {
    const clientX =
      e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
    const clientY =
      e instanceof MouseEvent ? e.clientY : e.changedTouches[0].clientY;

    dragElement.value.style.visibility = "hidden";
    const belowId = document
      .elementFromPoint(clientX, clientY)
      ?.closest(".draggable")?.id;
    dragElement.value.style.visibility = "visible";
    const holdingId = dragElement.value?.id;
    dragElement.value.style.position = "static";

    if (holdingId === belowId || belowId === null) return;
    const tmp = data.value.find((item) => item.order === Number(holdingId));
    data.value = data.value.filter((item) => item.order !== Number(holdingId));
    if (!tmp) return;

    const belowIndex = data.value.findIndex(
      (item) => item.order === Number(belowId),
    );
    data.value.splice(Number(belowIndex) + 1, 0, tmp);
  }
  dragElement.value = null;
  document.body.style.overflow = "";
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("scroll", preventDefault);
};

const update = async () => {
  const updates = data.value.map((el, index) => ({
    id: el.id,
    order: index + 1,
  }));

  for (const update of updates) {
    await updateOrderMutation.mutateAsync(update);
  }
};

const apply = () => {
  data.value.map((d) => {
    if (props.workout) {
      addNewWorkoutExercise(props.workout.workout_id, d.exercise_id);
    }
  });
};

const preventDefault = (e: Event) => e.preventDefault();

defineExpose({ update, apply, isOrdered });

onMounted(() => {
  document.addEventListener("mousemove", moveElement);
  document.addEventListener("mouseup", stopMoving);
  document.addEventListener("touchmove", moveElement);
  document.addEventListener("touchend", stopMoving);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", moveElement);
  document.removeEventListener("mouseup", stopMoving);
  document.removeEventListener("touchmove", moveElement);
  document.removeEventListener("touchend", stopMoving);
});

watch(
  () => props.plan,
  (newVal) => {
    if (newVal) data.value = newVal;
  },
);

const updatePlanExerciseRef = ref<InstanceType<
  typeof UpdatePlanExercise
> | null>(null);
</script>

<template>
  <div :class="{ 'border-t-2 border-sonja-akz': pos === -1 }">
    <div
      v-for="ex in data"
      class="draggable ofer cursor-move p-1 py-3"
      :class="{
        'border-b-2 border-sonja-akz': ex.order === pos,
      }"
      :key="ex.order"
      :id="String(ex.order)"
      @mousedown="startMoving($event, $event.target as HTMLElement)"
      @touchstart="startMoving($event, $event.target as HTMLElement)"
    >
      <div v-if="ex.name" class="relative mr-2 flex flex-col justify-between">
        <div>
          {{ ex.order }}. {{ ex.name }}
          <div class="absolute -top-4 right-auto z-0 flex gap-1">
            <UiChip
              v-for="c in ex.categories"
              :content="c.name"
              :type="c.type"
            />
          </div>
          <i
            class="fa-solid fa-edit cursor-pointer text-xl"
            @click.stop="
              updatePlanExerciseRef?.setForm({
                plan_id: ex.id,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                reps_to: ex.reps_to,
              })
            "
          />
          <i
            class="fa-solid fa-close ml-2 cursor-pointer text-red-800"
            @click.stop="
              confirmDeleteEx = true;
              toDeleteExId = Number(ex.id);
            "
          />
          <i
            class="fa-solid fa-check ml-2 cursor-pointer"
            @click.stop="
              addNewWorkoutExercise(props.workout?.workout_id, ex.exercise_id)
            "
          />
        </div>
        <div
          class="ml-1 border-l-4 border-sonja-text pl-2"
          v-if="ex.sets && ex.reps"
        >
          {{ ex.sets }}x{{ ex.reps }}{{ ex.reps_to ? "-" + ex.reps_to : ""
          }}{{ ex.metric === "Time" ? "s" : "" }}
        </div>
      </div>
    </div>
  </div>
  <button
    class="flex w-full justify-center rounded-full rounded-t bg-sonja-bg-darker pb-2 pt-3"
    @click="newExExerciseDialog = true"
  >
    <i class="fa-solid fa-plus" />
  </button>
  <BetterExerciseSelection
    v-if="newExExerciseDialog && categories && exercises"
    :categories="categories"
    :exercises="exercises"
    v-model:result="newExId"
    @close="newExExerciseDialog = false"
  />

  <DialogsDialog
    :is-open="newExDialog"
    @close="
      newExDialog = false;
      newExId = undefined;
    "
  >
    <UiNumberInput v-model:modelValue="newExSets" label="Sets" focus />
    <div class="flex items-center gap-1">
      <UiNumberInput v-model:modelValue="newExReps" label="from" />
      <UiNumberInput v-model:modelValue="newExRepsTo" label="to" />
    </div>
    <UiButtonsButton @action="newEx" class="mt-2">New Ex</UiButtonsButton>
  </DialogsDialog>

  <DialogsConfirm
    v-model:is-open="confirmDeleteEx"
    @no="confirmDeleteEx = false"
    @yes="deleteEx"
  />

  <UpdatePlanExercise ref="updatePlanExerciseRef" />
</template>
