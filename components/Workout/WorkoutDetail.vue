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

const logged = defineModel<LoggedType | undefined>("logged");

const workoutShow = ref<workoutShowType>({
  showRouter: logged.value?.loggedWorkoutId ? "workoutdetail" : "home",
});

const switchRouter = (route: workoutRouterTypes) => {
  workoutShow.value.showRouter = route;
};

const { data: exercises } = useExercisesByWorkout(
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
  <!-- Exercises List -->
  <SlideTransition>
    <div
      v-if="workoutShow.showRouter === 'workoutdetail'"
      class="absolute inset-0"
    >
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
</template>
