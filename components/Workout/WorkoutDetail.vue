<script setup lang="ts">
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import EquipSelection from "./EquipSelection.vue";
import type {
  workoutRouterTypes,
  workoutShowType,
  WorkoutType,
} from "~/utils/types";
import { useExercisesByWorkout } from "~/composables/Exercises/useExercisesByWorkout";

const props = defineProps<{
  equips: EquipType[] | undefined;
  muscles: MuscleType | undefined;
  workout: WorkoutType | undefined;
}>();

console.log(props.equips);

const showDialog = ref<boolean>(false);
const logged = defineModel<LoggedType | undefined>("logged");

const workoutShow = ref<workoutShowType>({
  showRouter: logged.value?.loggedWorkoutId ? "workoutdetail" : "home",
});

const switchRouter = (route: workoutRouterTypes) => {
  workoutShow.value.showRouter = route;
};

const updateWorkoutMutation = useUpdateWorkout(props.workout?.workout_id);

const updateWorkout = () => {
  updateWorkoutMutation.mutate(`locker = ${newLocker.value}`, {
    onSuccess: () => {
      showDialog.value = false;
      newLocker.value = undefined;
    },
  });
};

const newLocker = ref<number>();
const { data: exercises, isSuccess } = useExercisesByWorkout(
  computed(() => props.workout?.workout_id)
);

const exToShow = ref();

watch(
  () => logged.value,
  (newVal) => {
    if (newVal?.loggedWorkoutId) {
      switchRouter("workoutdetail");
    } else {
      switchRouter("home");
    }
  }
);

watch(
  () => logged.value?.user,
  () => {
    if (!logged.value?.loggedWorkoutId) {
      switchRouter("home");
    }
  }
);

watch(
  () => exToShow.value,
  (newVal) => {
    if (newVal) {
      switchRouter("exercisedetail");
    }
  }
);
</script>

<template>
  <SlideTransition>
    <div v-if="workoutShow.showRouter === 'home'" class="absolute inset-0">
      <Home v-model="logged" @switch="switchRouter('workoutdetail')" />
    </div>
  </SlideTransition>
  <SlideTransition>
    <div
      v-if="workoutShow.showRouter === 'workoutdetail'"
      class="absolute inset-0"
    >
      <div
        v-for="ex in exercises"
        class="border-b border-sonja-bg-darker rounded-full flex justify-center py-2 cursor-pointer"
        @click="
          exToShow = ex;
          workoutShow.showRouter = 'exercisedetail';
        "
      >
        {{ ex.equipName }}
      </div>
      <button
        class="w-full bg-sonja-bg-darker flex justify-center rounded-t rounded-full pt-3 pb-2"
        @click="() => (workoutShow.showRouter = 'equipselection')"
      >
        <i class="fa-solid fa-plus text-5xl" />
      </button>
      <button
        @click="showDialog = true"
        class="w-full flex justify-end pr-2 pt-2"
      >
        <i class="fa-solid fa-lock text-3xl" />
      </button>
    </div>
  </SlideTransition>
  <SlideTransition>
    <WorkoutExerciseDetail
      v-if="
        workoutShow.showRouter === 'exercisedetail' &&
        workout?.start &&
        workout.user_id
      "
      :exercise="exToShow"
      :workout-info="{ start: workout.start, user_id: workout.user_id }"
      v-model:workout-show="workoutShow"
      @close="
        exToShow = undefined;
        workoutShow.showRouter = 'workoutdetail';
      "
    />
  </SlideTransition>
  <SlideTransition>
    <div
      v-if="
        workoutShow.showRouter === 'equipselection' &&
        workout?.workout_id &&
        muscles &&
        equips
      "
      class="absolute inset-0"
    >
      <EquipSelection
        :workoutId="workout.workout_id"
        :muscles="muscles"
        :equips="equips"
        @close="workoutShow.showRouter = 'workoutdetail'"
      />
    </div>
  </SlideTransition>
  <Dialog :isOpen="showDialog" @close="showDialog = false">
    <div class="flex flex-col justify-center items-center gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          Lockernummer:
          <UiNumberInput
            v-if="!workout?.locker"
            v-model:modelValue="newLocker"
            :placeholder="String(workout?.locker)"
            focus
          />
          <div v-else>{{ workout?.locker }}</div>
        </div>
      </div>
      <Button @action="updateWorkout"> Done </Button>
    </div>
  </Dialog>
</template>
