<template>
  <div class="flex flex-col gap-2">
    <Textinput v-model="newCategoryName" label="Category name" />
    <Select
      :options="[
        { value: 'muscle', label: 'Muscle' },
        { value: 'exercise', label: 'Exercise' },
      ]"
      defaultSelected="muscle"
      default="Type"
      v-model="newCategoryType"
    />
  </div>
  <Button class="mt-4" @action="addCategory"> Neue Category! </Button>
</template>

<script setup lang="ts">
import type { CategoryTypes } from "~/utils/types";
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";
import Select from "../ui/select/Select.vue";

const newCategoryName = ref("");
const newCategoryType = ref<CategoryTypes>("muscle");

const emit = defineEmits<{
  (e: "close"): void;
}>();

const addCategoryMutation = useAddCategory();

const addCategory = () => {
  if (newCategoryName.value && newCategoryType.value) {
    addCategoryMutation.mutate(
      { name: newCategoryName.value, type: newCategoryType.value },
      {
        onSuccess: () => emit("close"),
      },
    );
  }
};
</script>
