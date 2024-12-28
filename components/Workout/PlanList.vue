<script setup lang="ts">
import useAddWorkoutExercise from "~/composables/useWorkoutExercise";

const props = defineProps<{
  plan: PlanExercise[];
  workout: WorkoutType | undefined;
}>();

defineEmits<{
  (e: "delete"): void;
}>();

const show = defineModel<ShowType>("show");
const updateOrderMutation = useUpdatePlanExercise();

const mutation = useAddWorkoutExercise();
const addNewWorkoutExercise = (workoutId: number, exercise_id: number) => {
  mutation.mutate(
    {
      workout_id: workoutId,
      exercise_id: exercise_id,
    },
    {
      onSuccess: () => {
        if (show.value) {
          show.value.showRouter = "workoutdetail";
        }
      },
      onError: (e) => console.error(e),
    },
  );
};

const toDeleteExId = defineModel();

const isDragging = ref(false);
const dragElement = ref<HTMLElement | null>(null);
const offsetX = ref(0);
const offsetY = ref(0);

const pos = ref<number | undefined>(undefined);

const data = ref(props.plan);

const startMoving = (e: MouseEvent | TouchEvent, element: HTMLElement) => {
  if ((e.target as HTMLElement).tagName === "I") return;
  e.preventDefault()
  isDragging.value = true;
  dragElement.value = element.closest(".draggable");
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  offsetX.value = clientX - element.getBoundingClientRect().left;
  offsetY.value = clientY - element.getBoundingClientRect().top;
};

const moveElement = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !dragElement.value) return;
  e.preventDefault()
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
  isDragging.value = false;
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
};

const update = () => {
  let i = 1;
  data.value.map((el) => {
    updateOrderMutation.mutate({
      id: el.id,
      order: i,
    });
    // el.order = i;
    i++;
  });
};

const apply = () => {
  data.value.map((d) => {
    if (props.workout) {
      addNewWorkoutExercise(props.workout.workout_id, d.exercise_id);
    }
  });
};

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
</script>

<template>
  <div class="overflow-auto" :class="{ 'border-t-2 border-sonja-akz': pos === -1 }">
    <div
      v-for="ex in data"
      class="draggable cursor-move p-1"
      :class="{
        'border-b-2 border-sonja-akz': ex.order === pos,
      }"
      :key="ex.order"
      :id="String(ex.order)"
      @mousedown="startMoving($event, $event.target as HTMLElement)"
      @touchstart="startMoving($event, $event.target as HTMLElement)"
    >
      <div v-if="ex.name" class="grid grid-cols-2">
        <div>
          {{ ex.order }} {{ ex.name }}
          <i
            class="fa-solid fa-close cursor-pointer text-red-800"
            @click.="
              $emit('delete');
              toDeleteExId = Number(ex.id);
            "
          />
        </div>
        <div class="ml-2" v-if="ex.sets && ex.reps">
          {{ ex.sets }}x{{ ex.reps }}{{ ex.reps_to ? "-" + ex.reps_to : ""
          }}{{ ex.metric === "Time" ? "s" : "kg" }}
        </div>
      </div>
    </div>
    <div class="my-2 flex w-full justify-evenly">
      <button
        @click.stop="update"
        class="rounded border-2 border-sonja-text p-2 shadow"
      >
        Update
      </button>
      <button
        v-if="props.workout"
        @click.stop="apply"
        class="rounded border-2 border-sonja-text p-2 shadow"
      >
        Apply
      </button>
    </div>
  </div>
</template>
