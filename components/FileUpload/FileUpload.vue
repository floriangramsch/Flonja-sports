<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import Button from "../ui/buttons/Button.vue";
import SmallButton from "../ui/buttons/SmallButton.vue";
import Dialog from "../Dialogs/Dialog.vue";

const loggedStore = useLoggedStore();

const isOpen = ref<boolean>(false);

const selectedFile = ref<File | undefined>(undefined);
const errorMessage = ref<string | undefined>(undefined);

const client = useQueryClient();
const uploadMutation = usePostFile();
const upload = () => {
  if (selectedFile.value && loggedStore.logged.user.name) {
    uploadMutation.mutate(
      { file: selectedFile.value, name: loggedStore.logged.user.name },
      {
        onSuccess: () => {
          client.invalidateQueries({
            queryKey: ["file", loggedStore.logged.user.name],
          });
        },
      },
    );
  } else {
    errorMessage.value = "No valid file.";
  }
};

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement | undefined;
  const files = target?.files;
  if (files && files[0]) {
    const file = files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (validTypes.includes(file.type)) {
      selectedFile.value = file;
      errorMessage.value = undefined;
    } else {
      errorMessage.value = "Only .jpg, .jpeg and .png files are allowed.";
      selectedFile.value = undefined;
    }
  }
}
</script>

<template>
  <SmallButton class="ml-4" @action="isOpen = true">
    <i class="fa-solid fa-image" />
  </SmallButton>
  <Dialog
    :isOpen
    @close="
      isOpen = false;
      selectedFile = undefined;
      errorMessage = undefined;
    "
  >
    <div class="flex w-full flex-col items-center justify-center gap-3">
      <div class="text-3xl font-bold">Profilepicture</div>
      <div class="space-x-2">
        <label
          for="file-input"
          class="cursor-pointer rounded bg-sonja-text p-2 text-sonja-akz2"
        >
          Choose a file
        </label>
        <input
          id="file-input"
          type="file"
          @change="onFileSelected"
          class="hidden"
        />
        <span v-if="selectedFile" class="text-gray-600">
          {{ selectedFile.name }}
        </span>
      </div>

      <Button v-if="selectedFile" @action="upload">Upload</Button>
      <span v-if="selectedFile" class="text-gray-600">Maybe you have to restart the page.</span>
      <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
    </div>
  </Dialog>
</template>
