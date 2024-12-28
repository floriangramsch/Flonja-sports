<script setup lang="ts">
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import NewCategory from "../Dialogs/NewCategory.vue";
import Button from "../ui/buttons/Button.vue";

defineProps<{
  categories: CategoryType[];
}>();

const routerStore = useRouterStore()
const showDialogNewCategory = ref<boolean>(false);
const showDialogDeleteCategory = ref<boolean>(false);
const showDialogCategory = ref<boolean>(false);

const categoryForm = ref<{
  category_id?: number;
  category_name?: string;
}>({
  category_id: undefined,
  category_name: undefined,
});
const mutation = useUpdateCategory();
const deleteMutation = useDeleteCategory();

const updateCategory = () => {
  if (categoryForm.value.category_id && categoryForm.value.category_name) {
    mutation.mutate(
      {
        category_id: categoryForm.value.category_id,
        name: categoryForm.value.category_name,
      },
      {
        onSuccess: () => {
          showDialogCategory.value = false;
          showDialogDeleteCategory.value = false;
          showDialogNewCategory.value = false;
          categoryForm.value = {
            category_id: undefined,
            category_name: undefined,
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
        };
      },
    });
  }
};
</script>

<template>
  <!-- Header -->
  <div class="flex w-full justify-center px-2 py-4">
    <button
      class="absolute left-6 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
      @click="routerStore.route = 'exerciselist'"
    >
      <i class="fa-solid fa-repeat" />
    </button>
    <div class="text-center text-4xl font-bold">Category List</div>
    <!-- New Category -->
    <Dialog :isOpen="showDialogNewCategory" @close="showDialogNewCategory = false">
      <template v-slot:trigger>
        <button
          class="absolute right-6 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="showDialogNewCategory = true"
        >
          <i class="fa-solid fa-plus" />
        </button>
      </template>
      <NewCategory @close="showDialogNewCategory = false" />
    </Dialog>
  </div>

  <!-- Category list -->
  <div
    v-for="category in categories"
    @click="
      categoryForm = {
        category_id: category.category_id,
        category_name: category.category_name,
      };
      showDialogCategory = true;
    "
    class="m-2 flex w-full cursor-pointer justify-center"
  >
    <div
      class="flex w-1/2 justify-center rounded bg-sonja-text p-2 text-sonja-akz2 shadow"
    >
      {{ category.category_name }}
    </div>
  </div>

  <!-- Handle Category -->
  <Dialog :isOpen="showDialogCategory" @close="showDialogCategory = false">
    <UiInputsTextinput v-model="categoryForm.category_name" label="Category name" focus />
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
