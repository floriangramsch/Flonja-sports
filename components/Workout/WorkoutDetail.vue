<script setup lang="ts">
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import type {
  ExerciseType,
  WorkoutExerciseType,
  WorkoutRouterTypes,
  workoutShowType,
  WorkoutType,
} from "~/utils/types";
import Confirm from "../Dialogs/Confirm.vue";
import ExerciseSelection from "./ExerciseSelection.vue";
import WorkoutExerciseDetail from "./WorkoutExerciseDetail.vue";

const props = defineProps<{
  exercises: ExerciseType[] | undefined;
  categories: CategoryType[] | undefined;
  workout: WorkoutType | undefined;
}>();

const logged = defineModel<LoggedType | undefined>("logged");
const exerciceFilter = defineModel<number[]>("filter");
const show = defineModel<ShowType>("show");

defineEmits<{
  (emits: "startTimer"): void;
}>();

const showConfirmEndWorkout = ref<boolean>(false);

const workoutShow = ref<workoutShowType>({
  showRouter: logged.value?.loggedWorkoutId ? "workoutdetail" : "home",
});

const switchRouter = (route: WorkoutRouterTypes) => {
  workoutShow.value.showRouter = route;
};

const { data: workoutExercises } = useWorkoutExercisesByWorkout(
  computed(() => props.workout?.workout_id),
);

const workoutExToShow = ref<WorkoutExerciseType>();

const showLockerDialog = ref<boolean>(false);
const newLocker = ref<number | undefined>(props.workout?.locker);
const updateLockerMutation = useUpdateWorkout();

const updateWorkout = () => {
  if (props.workout?.workout_id && newLocker.value)
    updateLockerMutation.mutate(
      {
        updatedData: `locker = ${newLocker.value}`,
        workout_id: props.workout?.workout_id,
      },
      {
        onSuccess: () => {
          showLockerDialog.value = false;
          newLocker.value = undefined;
        },
      },
    );
};

const endWorkout = () => {
  if (props.workout?.workout_id && !props.workout.end) {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const end = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    updateLockerMutation.mutate(
      {
        updatedData: `end = '${end}'`,
        workout_id: props.workout?.workout_id,
      },
      {
        onSuccess: () => {
          showConfirmEndWorkout.value = false;
        },
      },
    );
  }
};

watch(
  () => logged.value,
  (newVal) => {
    if (newVal?.loggedWorkoutId) {
      switchRouter("workoutdetail");
    } else {
      switchRouter("home");
    }
  },
);

watch(
  () => logged.value?.user,
  () => {
    if (!logged.value?.loggedWorkoutId) {
      switchRouter("home");
    }
  },
);

watch(
  () => workoutExToShow.value,
  (newVal) => {
    if (newVal) {
      switchRouter("workoutexercisedetail");
    }
  },
);

watch(
  () => props.workout?.locker,
  (newVal) => {
    if (newVal) {
      newLocker.value = newVal;
    } else {
      newLocker.value = undefined;
    }
  },
);
</script>

<template>
  <SlideTransition>
    <div v-if="workoutShow.showRouter === 'home'" class="absolute inset-0">
      <Home v-model="logged" @switch="switchRouter('workoutdetail')" />
    </div>
  </SlideTransition>
  <!-- Workout Exercises List -->
  <SlideTransition>
    <div
      v-if="workoutShow.showRouter === 'workoutdetail'"
      class="absolute inset-0"
    >
      <!-- Header -->
      <div class="flex w-full justify-evenly px-2 py-4">
        <!-- End Workout -->
        <Confirm
          v-model:isOpen="showConfirmEndWorkout"
          @yes="endWorkout"
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          :disabled="workout?.end ? true : false"
        >
          <i
            class="fa-solid fa-cat"
            :class="workout?.end ? 'opacity-50' : ''"
          />
        </Confirm>
        <div class="text-center text-4xl font-bold">Exercises</div>
        <!-- Locker -->
        <button
          @click="showLockerDialog = true"
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        >
          <i class="fa-solid fa-lock" />
        </button>
        <Dialog :isOpen="showLockerDialog" @close="showLockerDialog = false">
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="flex gap-2">
              <UiNumberInput
                v-model:modelValue="newLocker"
                label="Lockernummer"
                :focus="!workout?.locker"
              />
            </div>
            <Button @action="updateWorkout"> Done </Button>
          </div>
        </Dialog>
      </div>
      <div
        v-if="workoutExercises?.length !== 0"
        v-for="wex in workoutExercises"
        class="group relative flex cursor-pointer items-center justify-center rounded-full border-b border-sonja-bg-darker py-3"
        @click="
          workoutExToShow = wex;
          workoutShow.showRouter = 'workoutexercisedetail';
        "
      >
        {{ wex.exercise_name }}
        <button
          class="ml-2"
          @click.stop="
            exerciceFilter = [wex.exercise_id];
            if (show) show.showRouter = 'workoutexercises';
          "
        >
          <i class="fa-solid fa-chart-line text-sonja-akz" />
        </button>
        <div class="absolute -top-1 right-auto z-0 flex gap-1">
          <div
            class="rounded bg-sonja-akz p-1 text-xs/[8px] shadow transition-all duration-300 group-hover:-right-8 group-hover:-translate-y-2 group-hover:-rotate-[20deg]"
          >
            {{ wex.category_name }}
          </div>
          <div
            class="rounded bg-yellow-500 p-1 text-xs/[8px] shadow transition-all duration-300 group-hover:-right-8 group-hover:-translate-y-2 group-hover:-rotate-[20deg]"
          >
            {{ wex.metric }}
          </div>
          <div
            class="rounded bg-red-700 p-1 text-xs/[8px] shadow transition-all duration-300 group-hover:-right-8 group-hover:-translate-y-2 group-hover:-rotate-[20deg]"
          >
            {{ wex.type }}
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="flex h-20 w-full cursor-pointer items-center justify-center bg-sonja-bg-darker text-3xl font-bold"
          @click="() => (workoutShow.showRouter = 'exerciseselection')"
        >
          Start Workout
        </div>
      </div>
      <button
        class="flex w-full justify-center rounded-full rounded-t bg-sonja-bg-darker pb-2 pt-3"
        @click="() => (workoutShow.showRouter = 'exerciseselection')"
      >
        <i class="fa-solid fa-plus text-5xl" />
      </button>
    </div>
  </SlideTransition>
  <!-- Workout Exercise Detail -->
  <SlideTransition>
    <WorkoutExerciseDetail
      v-if="
        workoutShow.showRouter === 'workoutexercisedetail' &&
        workout?.start &&
        workout.user_id && workoutExToShow
      "
      :workout-exercise="workoutExToShow"
      :workout-info="{
        start: workout.start,
        user_id: workout.user_id,
        rest_time: workout.rest_time,
      }"
      :exercise="
        exercises?.find((e: ExerciseType) => e.exercise_id === workoutExToShow?.exercise_id)
      "
      v-model:workout-show="workoutShow"
      @close="
        workoutExToShow = undefined;
        workoutShow.showRouter = 'workoutdetail';
      "
      @startTimer="$emit('startTimer')"
    />
  </SlideTransition>
  <!-- Exercise Selection -->
  <SlideTransition>
    <div
      v-if="
        workoutShow.showRouter === 'exerciseselection' &&
        workout?.workout_id &&
        categories &&
        exercises
      "
      class="absolute inset-0"
    >
      <ExerciseSelection
        :workoutId="workout.workout_id"
        :categories="categories"
        :exercises="exercises"
        v-model="workoutExToShow"
        @close="workoutShow.showRouter = 'workoutdetail'"
      />
    </div>
  </SlideTransition>
</template>
