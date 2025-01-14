<script setup lang="ts">
import { ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import Button from "../ui/buttons/Button.vue";
import SmallButton from "../ui/buttons/SmallButton.vue";
import Dialog from "../Dialogs/Dialog.vue";

const loggedStore = useLoggedStore();
const isOpen = ref<boolean>(false);
const selectedFile = ref<File | undefined>(undefined);
const scaledImage = ref<string | undefined>(undefined);
const errorMessage = ref<string | undefined>(undefined);

const client = useQueryClient();
const uploadMutation = usePostFile();

const upload = () => {
  if (scaledImage.value && loggedStore.logged.user.name) {
    const blob = dataURLToBlob(scaledImage.value);
    if (!blob) {
      errorMessage.value = "Failed to process the image.";
      return;
    }
    uploadMutation.mutate(
      { file: new File([blob], "scaled-image.jpg"), name: loggedStore.logged.user.name },
      {
        onSuccess: () => {
          client.invalidateQueries({
            queryKey: ["file", loggedStore.logged.user.name],
          });
        },
      }
    );
  } else {
    errorMessage.value = "No valid file.";
  }
};

function scale(file: File) {
  const maxWidth = 800;
  const maxHeight = 800;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      scaledImage.value = canvas.toDataURL("image/jpeg", 0.8);
    };

    if (e.target?.result) {
      img.src = e.target.result as string;
    }
  };

  reader.readAsDataURL(file);
}

function dataURLToBlob(dataURL: string): Blob | null {
  const parts = dataURL.split(",");
  const mime = parts[0]?.match(/:(.*?);/)?.[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return mime ? new Blob([arrayBuffer], { type: mime }) : null;
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement | undefined;
  const files = target?.files;
  if (files && files[0]) {
    const file = files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (validTypes.includes(file.type)) {
      selectedFile.value = file;
      scale(file); // Bild skalieren
      errorMessage.value = undefined;
    } else {
      errorMessage.value = "Only .jpg, .jpeg and .png files are allowed.";
      selectedFile.value = undefined;
    }
  }
}
</script>

<template>
  <SmallButton class="ml-4 mb-3" @action="isOpen = true">
    New Profilepicture
  </SmallButton>
  <Dialog
    :isOpen
    @close="
      isOpen = false;
      selectedFile = undefined;
      scaledImage = undefined;
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

      <Button v-if="scaledImage" @action="upload">Upload</Button>
      <span v-if="scaledImage" class="text-gray-600">
        Maybe you have to restart the page.
      </span>
      <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
    </div>
  </Dialog>
</template>
