<template>
  <Textinput v-model="newCategoryName" label="Category name" />
  <Button class="mt-4" @action="addCategory"> Neue Category! </Button>
</template>

<script setup lang="ts">
import Button from "../ui/buttons/Button.vue";
import Textinput from "../ui/inputs/Textinput.vue";

const newCategoryName = ref("");

const emit = defineEmits<{
  (e: "close"): void;
}>();

const addCategoryMutation = useAddCategory();

const addCategory = () => {
  if (newCategoryName.value) {
    addCategoryMutation.mutate(newCategoryName.value, {
      onSuccess: () => emit("close"),
    });
  }
};
</script>
