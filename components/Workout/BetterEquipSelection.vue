<script setup lang="ts">
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import NewEquip from "../Dialogs/NewEquip.vue";
import NewCategory from "../Dialogs/NewCategory.vue";

const props = defineProps<{
  categories: CategoryType[];
  equips: EquipType[];
}>();

const exToShow = defineModel();
const result = defineModel("result");

const emit = defineEmits<{
  (e: "close"): void;
}>();

const chosenCategory = ref<CategoryType>();
const chooseCategory = (category: CategoryType) => {
  chosenCategory.value = category;
  showCategoryOverview.value = false;
  showEquipOverview.value = true;
};

const equipsToShow = computed(() => {
  return props.equips.filter(
    (equip) => equip.category_name === chosenCategory.value?.category_name,
  );
});

const showCategoryOverview = ref<boolean>(true);
const showDialogCategory = ref<boolean>(false);
const showEquipOverview = ref<boolean>(false);
const showDialogEquip = ref<boolean>(false);
</script>

<template>
  <!-- category Selection -->
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
      class="grid grid-cols-3 place-items-center gap-2 overflow-auto"
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

  <!-- Equip Selection -->
  <div v-if="showEquipOverview">
    <div class="flex w-full justify-evenly">
      <button
        class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
        @click="
          showCategoryOverview = true;
          showEquipOverview = false;
        "
      >
        <i class="fa-solid fa-arrow-left" />
      </button>
      <div class="text-center text-4xl font-bold">Equipment</div>
      <div class=""></div>
    </div>
    <div class="mt-4 flex flex-col">
      <div
        v-for="equip in equipsToShow"
        @click="
          result = equip.exercise_id;
          emit('close');
        "
        class="flex cursor-pointer justify-center border-b-4 border-sonja-bg-darker py-2"
      >
        {{ equip.exercise_name }}
      </div>
      <Dialog :isOpen="showDialogEquip" @close="showDialogEquip = false">
        <template v-slot:trigger>
          <Button @action="showDialogEquip = true"> Neues Gerät </Button>
        </template>
        <NewEquip
          @close="showDialogEquip = false"
          :category_id="chosenCategory?.category_id"
        />
      </Dialog>
    </div>
  </div>
</template>
