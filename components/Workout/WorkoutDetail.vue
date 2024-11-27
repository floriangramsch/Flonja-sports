<script setup lang="ts">
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import EquipSelection from "./EquipSelection.vue";
import type {
  ExerciseType,
  WorkoutRouterTypes,
  workoutShowType,
  WorkoutType,
} from "~/utils/types";
import { useExercisesByWorkout } from "~/composables/Exercises/useExercisesByWorkout";
import Confirm from "../Dialogs/Confirm.vue";

const props = defineProps<{
  equips: EquipType[] | undefined;
  muscles: MuscleType[] | undefined;
  workout: WorkoutType | undefined;
}>();

const logged = defineModel<LoggedType | undefined>("logged");

const showConfirmEndWorkout = ref<boolean>(false);

const workoutShow = ref<workoutShowType>({
  showRouter: logged.value?.loggedWorkoutId ? "workoutdetail" : "home",
});

const switchRouter = (route: WorkoutRouterTypes) => {
  workoutShow.value.showRouter = route;
};

const { data: exercises } = useExercisesByWorkout(
  computed(() => props.workout?.workout_id)
);

const exToShow = ref<ExerciseType>();

const showLockerDialog = ref<boolean>(false);
const newLocker = ref<number>();
const updateLockerMutation = useUpdateWorkout();

const updateWorkout = () => {
  if (props.workout?.workout_id)
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
      }
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
      }
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
  <!-- Exercises List -->
  <SlideTransition>
    <div
      v-if="workoutShow.showRouter === 'workoutdetail'"
      class="absolute inset-0"
    >
      <!-- Header -->
      <div class="w-full flex justify-evenly py-4 px-2">
        <!-- End Workout -->
        <Confirm
          v-model:isOpen="showConfirmEndWorkout"
          @yes="endWorkout"
          class="flex items-center bg-sonja-bg-darker text-sonja-text h-10 px-4 rounded-full shadow"
          :disabled="workout?.end ? true : false"
        >
          <i
            class="fa-solid fa-cat"
            :class="workout?.end ? 'opacity-50' : ''"
          />
        </Confirm>
        <div class="text-4xl font-bold text-center">Exercises</div>
        <!-- Locker -->
        <button
          @click="showLockerDialog = true"
          class="flex items-center bg-sonja-bg-darker text-sonja-text h-10 px-4 rounded-full shadow"
        >
          <i class="fa-solid fa-lock" />
        </button>
        <Dialog :isOpen="showLockerDialog" @close="showLockerDialog = false">
          <div class="flex flex-col justify-center items-center gap-4">
            <div class="flex gap-2">
              Lockernummer:
              <UiNumberInput
                v-if="!workout?.locker"
                v-model:modelValue="newLocker"
                :placeholder="workout?.locker ? String(workout?.locker) : ''"
                focus
              />
              <div v-else>{{ workout?.locker }}</div>
            </div>
            <Button @action="updateWorkout"> Done </Button>
          </div>
        </Dialog>
      </div>
      <div
        v-if="exercises?.length !== 0"
        v-for="ex in exercises"
        class="border-b border-sonja-bg-darker rounded-full flex justify-center py-2 cursor-pointer"
        @click="
          exToShow = ex;
          workoutShow.showRouter = 'exercisedetail';
        "
      >
        {{ ex.equipName }}
      </div>
      <div v-else>
        <div
          class="bg-sonja-bg-darker w-full h-20 flex justify-center items-center text-3xl font-bold cursor-pointer"
          @click="() => (workoutShow.showRouter = 'equipselection')"
        >
          Start Workout
        </div>
      </div>
      <button
        class="w-full bg-sonja-bg-darker flex justify-center rounded-t rounded-full pt-3 pb-2"
        @click="() => (workoutShow.showRouter = 'equipselection')"
      >
        <i class="fa-solid fa-plus text-5xl" />
      </button>
    </div>
  </SlideTransition>
  <!-- Exercise Detail -->
  <SlideTransition>
    <WorkoutExerciseDetail
      v-if="
        workoutShow.showRouter === 'exercisedetail' &&
        workout?.start &&
        workout.user_id
      "
      :exercise="exToShow"
      :workout-info="{ start: workout.start, user_id: workout.user_id }"
      :equip="equips?.find((e) => e.equip_id === exToShow?.equip_id)"
      v-model:workout-show="workoutShow"
      @close="
        exToShow = undefined;
        workoutShow.showRouter = 'workoutdetail';
      "
    />
  </SlideTransition>
  <!-- Equip Selection -->
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
        v-model="exToShow"
        @close="workoutShow.showRouter = 'workoutdetail'"
      />
    </div>
  </SlideTransition>
</template>
