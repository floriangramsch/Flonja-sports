<script setup lang="ts">
import useExercisesByWorkout from "~/composables/Exercises/useExercisesByWorkout";
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";

const props = defineProps<{
  equips: EquipType;
  workout: LoggedWorkout;
}>();

const show = defineModel<any>();
const showDialog = ref<boolean>(false);

const updateWorkoutMutation = useUpdateWorkout(props.workout.id);

const updateWorkout = () => {
  updateWorkoutMutation.mutate(`locker = ${newLocker.value}`, {
    onSuccess: () => {
      showDialog.value = false;
      newLocker.value = undefined;
    },
  });
};

const newLocker = ref<number>();
const { data: exercises } = useExercisesByWorkout(props.workout.id);

const exToShow = ref();

const dialogRef = ref<HTMLInputElement | null>(null);

watch(
  () => dialogRef.value,
  (newVal) => {
    if (newVal) {
      newVal.focus();
    }
  }
);
</script>

<template>
  <SlideTransition>
    <div v-if="!exToShow" class="absolute inset-0">
      <div
        v-for="ex in exercises"
        class="border-b border-sonja-bg-darker rounded-full flex justify-center py-2 cursor-pointer"
        @click="exToShow = ex"
      >
        {{ ex.equipName }}
      </div>
      <button
        class="w-full bg-sonja-bg-darker flex justify-center"
        @click="() => (show.showRouter = 'equipselection')"
      >
        <i class="fa-solid fa-plus text-3xl" />
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
      v-if="exToShow"
      :exercise="exToShow"
      @close="exToShow = undefined"
    />
  </SlideTransition>
  <Dialog :isOpen="showDialog" @close="showDialog = false">
    <div class="flex flex-col justify-center items-center gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          Lockernummer:
          <input
            v-model="newLocker"
            :placeholder="String(workout.locker)"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            class="w-10 remove-arrow"
            ref="dialogRef"
          />
        </div>
      </div>
      <Button @action="updateWorkout"> Done </Button>
    </div>
  </Dialog>
</template>
