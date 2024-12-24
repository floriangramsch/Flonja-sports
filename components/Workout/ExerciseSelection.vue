<script setup lang="ts">
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import NewCategory from "../Dialogs/NewCategory.vue";
import useAddWorkoutExercise from "~/composables/useWorkoutExercise";
import NewExercise from "../Dialogs/NewExercise.vue";

const props = defineProps<{
  workoutId: number;
  categories: CategoryType[];
  exercises: ExerciseType[];
}>();

const exToShow = defineModel();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const chosenCategory = ref<CategoryType>();
const chooseCategory = (category: CategoryType) => {
  chosenCategory.value = category;
  showCategoryOverview.value = false;
  showExerciseOverview.value = true;
};

const exercisesToShow = computed(() => {
  return props.exercises.filter(
    (ex) => ex.category_name === chosenCategory.value?.category_name,
  );
});

const showCategoryOverview = ref<boolean>(true);
const showDialogCategory = ref<boolean>(false);
const showExerciseOverview = ref<boolean>(false);
const showDialogExercise = ref<boolean>(false);

const mutation = useAddWorkoutExercise();

const addNewWorkoutExercise = (exercise_id: number) => {
  mutation.mutate(
    {
      workout_id: props.workoutId,
      exercise_id: exercise_id,
    },
    {
      onSuccess: (res) => {
        const exercise = props.exercises.find((ex) => ex.exercise_id === exercise_id);
        exToShow.value = {
          exercise_name: exercise?.exercise_name,
          exercise_id: exercise_id,
          workout_exercise_id: res.insertId,
          type: exercise?.type,
          metric: exercise?.metric,
        };
        emit("close");
      },
      onError: (e) => console.error(e),
    },
  );
};
</script>

<template>
  <!-- category Selection -->
  <SlideTransition>
    <div v-if="showCategoryOverview">
      <div class="flex w-full justify-evenly py-4">
        <button
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="emit('close')"
        >
          <i class="fa-solid fa-arrow-left" />
        </button>
        <div class="text-center text-4xl font-bold">Category</div>
        <div></div>
      </div>
      <div
        class="inset-0 grid grid-cols-3 place-items-center gap-2 overflow-auto"
      >
        <div
          class="flex size-28 cursor-pointer items-center justify-center overflow-auto border-4 border-sonja-bg-darker"
          @click="chooseCategory(category)"
          v-for="category in categories"
          :key="category.category_id"
        >
          {{ category.category_name }}
        </div>
        <Dialog :isOpen="showDialogCategory" @close="showDialogCategory = false">
          <template v-slot:trigger>
            <div
              class="flex size-28 cursor-pointer items-center overflow-auto border-4 border-black bg-sonja-text text-center text-sonja-akz2"
              @click="showDialogCategory = true"
            >
              New Category
            </div>
          </template>
          <NewCategory @close="showDialogCategory = false" />
        </Dialog>
      </div>
    </div>
  </SlideTransition>

  <!-- Exercise Selection -->
  <SlideTransition>
    <div v-if="showExerciseOverview">
      <div class="flex w-full justify-evenly py-4">
        <button
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="
            showCategoryOverview = true;
            showExerciseOverview = false;
          "
        >
          <i class="fa-solid fa-arrow-left" />
        </button>
        <div class="text-center text-4xl font-bold">Exercises</div>
        <div class=""></div>
      </div>
      <div class="absolute inset-0 mt-16 flex flex-col">
        <div
          v-for="ex in exercisesToShow"
          @click="addNewWorkoutExercise(Number(ex.exercise_id))"
          class="flex cursor-pointer justify-center border-b-4 border-sonja-bg-darker py-2"
        >
          {{ ex.exercise_name }}
        </div>
        <Dialog :isOpen="showDialogExercise" @close="showDialogExercise = false">
          <template v-slot:trigger>
            <Button @action="showDialogExercise = true"> Neues Gerät </Button>
          </template>
          <NewExercise
            @close="showDialogExercise = false"
            :category_id="chosenCategory?.category_id"
          />
        </Dialog>
      </div>
    </div>
  </SlideTransition>
</template>
