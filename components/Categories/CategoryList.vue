<script setup lang="ts">
import type { CategoryTypes } from "~/utils/types";
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import NewCategory from "../Dialogs/NewCategory.vue";
import Button from "../ui/buttons/Button.vue";
import Select from "../ui/select/Select.vue";

defineProps<{
  categories: CategoryType[];
}>();

const routerStore = useRouterStore();
const showDialogNewCategory = ref<boolean>(false);
const showDialogDeleteCategory = ref<boolean>(false);
const showDialogCategory = ref<boolean>(false);

const categoryForm = ref<{
  category_id?: number;
  category_name?: string;
  category_type: CategoryTypes;
}>({
  category_id: undefined,
  category_name: undefined,
  category_type: "muscle",
});
const mutation = useUpdateCategory();
const deleteMutation = useDeleteCategory();

const updateCategory = () => {
  if (categoryForm.value.category_id && categoryForm.value.category_name) {
    mutation.mutate(
      {
        category_id: categoryForm.value.category_id,
        name: categoryForm.value.category_name,
        category_type: categoryForm.value.category_type
      },
      {
        onSuccess: () => {
          showDialogCategory.value = false;
          showDialogDeleteCategory.value = false;
          showDialogNewCategory.value = false;
          categoryForm.value = {
            category_id: undefined,
            category_name: undefined,
            category_type: "muscle",
          };
        },
      },
    );
  }
};

const deleteCategory = () => {
  if (categoryForm.value.category_id) {
    deleteMutation.mutate(categoryForm.value.category_id, {
      onSuccess: () => {
        showDialogCategory.value = false;
        showDialogDeleteCategory.value = false;
        showDialogNewCategory.value = false;
        categoryForm.value = {
          category_id: undefined,
          category_name: undefined,
          category_type: 'muscle',
        };
      },
    });
  }
};
</script>

<template>
  <Header
    @left="routerStore.route = 'exerciselist'"
    leftIcon="fa-solid fa-repeat"
  >
    Category List
    <template #right-pure>
      <Dialog
        :isOpen="showDialogNewCategory"
        @close="showDialogNewCategory = false"
      >
        <template v-slot:trigger>
          <button
            class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
            @click="showDialogNewCategory = true"
          >
            <i class="fa-solid fa-plus" />
          </button>
        </template>
        <NewCategory @close="showDialogNewCategory = false" />
      </Dialog>
    </template>
  </Header>
  <!-- Category list -->
  <div
    v-for="category in categories"
    @click="
      categoryForm = {
        category_id: category.id,
        category_name: category.name,
        category_type: category.type,
      };
      showDialogCategory = true;
    "
    class="m-2 flex w-full cursor-pointer justify-center"
  >
    <div
      class="flex w-1/2 justify-center rounded bg-sonja-text p-2 text-sonja-akz2 shadow"
    >
      {{ category.name }}
    </div>
  </div>

  <!-- Handle Category -->
  <Dialog :isOpen="showDialogCategory" @close="showDialogCategory = false">
    <div class="flex flex-col gap-2">
      <UiInputsTextinput
        v-model="categoryForm.category_name"
        label="Category name"
        focus
      />
      <Select
        :options="[
          { value: 'muscle', label: 'Muscle' },
          { value: 'exercise', label: 'Exercise' },
        ]"
        :defaultSelected="categoryForm.category_type"
        default="Type"
        v-model="categoryForm.category_type"
      />
    </div>
    <div class="mt-4 flex w-full justify-center gap-2">
      <Button @action="updateCategory">Update</Button>
      <Confirm
        v-model:isOpen="showDialogDeleteCategory"
        @yes="deleteCategory"
        class="flex h-10 items-center rounded-full bg-sonja-text px-4 text-red-600 shadow"
      >
        Delete
      </Confirm>
    </div>
  </Dialog>
</template>
