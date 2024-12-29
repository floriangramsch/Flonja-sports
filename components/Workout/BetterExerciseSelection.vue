<script setup lang="ts">
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import NewCategory from "../Dialogs/NewCategory.vue";
import NewExercise from "../Dialogs/NewExercise.vue";

const props = defineProps<{
  categories: CategoryType[];
  exercises: ExerciseType[];
}>();

const result = defineModel("result");

const isOpen = ref<boolean>(true)

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
    // (ex) => ex.category_name === chosenCategory.value?.category_name,
    (ex) => ex.categories.some(c => chosenCategory.value?.name === c.name),
  );
});

const showCategoryOverview = ref<boolean>(true);
const showDialogCategory = ref<boolean>(false);
const showExerciseOverview = ref<boolean>(false);
const showDialogExercise = ref<boolean>(false);
</script>

<template>
  <Dialog :isOpen @close="$emit('close')" w="25rem">
    <!-- category Selection -->
    <div v-if="showCategoryOverview">
      <Header @left="emit('close')" leftIcon="fa-solid fa-arrow-left">
        Category
      </Header>
      <div class="grid grid-cols-3 place-items-center gap-2 overflow-auto">
        <div
          class="flex size-28 cursor-pointer items-center justify-center overflow-auto border-4 border-sonja-bg-darker text-center font-bold"
          @click="chooseCategory(category)"
          v-for="category in categories"
          :key="category.id"
        >
          {{ category.name }}
        </div>
        <Dialog
          :isOpen="showDialogCategory"
          @close="showDialogCategory = false"
        >
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

    <!-- Exercise Selection -->
    <div v-if="showExerciseOverview">
      <Header
        @left="
          showCategoryOverview = true;
          showExerciseOverview = false;
        "
        leftIcon="fa-solid fa-arrow-left"
      >
        Exercises
      </Header>
      <div class="mt-4 flex flex-col">
        <div
          v-for="ex in exercisesToShow"
          @click="
            result = ex.exercise_id;
            emit('close');
          "
          class="flex cursor-pointer justify-center border-b-4 border-sonja-bg-darker py-2"
        >
          {{ ex.exercise_name }}
        </div>
        <Dialog
          :isOpen="showDialogExercise"
          @close="showDialogExercise = false"
        >
          <template v-slot:trigger>
            <Button @action="showDialogExercise = true"> New Exercise </Button>
          </template>
          <NewExercise
            @close="showDialogExercise = false"
            :category_id="chosenCategory?.id"
          />
        </Dialog>
      </div>
    </div>
  </Dialog>
</template>
