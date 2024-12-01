<script setup lang="ts">
import Confirm from "../Dialogs/Confirm.vue";
import Dialog from "../Dialogs/Dialog.vue";
import NewMuskle from "../Dialogs/NewMuskle.vue";
import Button from "../ui/buttons/Button.vue";

defineProps<{
  muscles: MuscleType[];
}>();

const show = defineModel<ShowType>("show");

const showDialogNewMuscle = ref<boolean>(false);
const showDialogDeleteMuscle = ref<boolean>(false);
const showDialogMuscle = ref<boolean>(false);

const muscleForm = ref<{
  muscle_id?: number;
  name?: string;
}>({
  muscle_id: undefined,
  name: undefined,
});
const mutation = useUpdateMuscle();
const deleteMutation = useDeleteMuscle();

const updateMuscle = () => {
  if (muscleForm.value.muscle_id && muscleForm.value.name) {
    mutation.mutate(
      {
        muscle_id: muscleForm.value.muscle_id,
        name: muscleForm.value.name,
      },
      {
        onSuccess: () => {
          showDialogMuscle.value = false;
          showDialogDeleteMuscle.value = false;
          showDialogNewMuscle.value = false;
          muscleForm.value = {
            muscle_id: undefined,
            name: undefined,
          };
        },
      },
    );
  }
};

const deleteMuscle = () => {
  if (muscleForm.value.muscle_id) {
    deleteMutation.mutate(muscleForm.value.muscle_id, {
      onSuccess: () => {
        showDialogMuscle.value = false;
        showDialogDeleteMuscle.value = false;
        showDialogNewMuscle.value = false;
        muscleForm.value = {
          muscle_id: undefined,
          name: undefined,
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
      v-if="show"
      class="absolute left-6 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
      @click="show.showRouter = 'equiplist'"
    >
      <i class="fa-solid fa-repeat" />
    </button>
    <div class="text-center text-4xl font-bold">Muscle List</div>
    <!-- New Muscle -->
    <Dialog :isOpen="showDialogNewMuscle" @close="showDialogNewMuscle = false">
      <template v-slot:trigger>
        <button
          class="absolute right-6 flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="showDialogNewMuscle = true"
        >
          <i class="fa-solid fa-plus" />
        </button>
      </template>
      <NewMuskle @close="showDialogNewMuscle = false" />
    </Dialog>
  </div>

  <!-- Muscle list -->
  <div
    v-for="muscle in muscles"
    @click="
      muscleForm = {
        muscle_id: muscle.muscle_group_id,
        name: muscle.muscle_name,
      };
      showDialogMuscle = true;
    "
    class="m-2 flex w-full cursor-pointer justify-center"
  >
    <div
      class="flex w-1/2 justify-center rounded bg-sonja-text p-2 text-sonja-akz2 shadow"
    >
      {{ muscle.muscle_name }}
    </div>
  </div>

  <!-- Handle Muscle -->
  <Dialog :isOpen="showDialogMuscle" @close="showDialogMuscle = false">
    <!-- <input v-model="muscleForm.name" /> -->
    <UiInputsTextinput v-model="muscleForm.name" label="Muskle name" focus />
    <div class="mt-4 flex w-full justify-center gap-2">
      <Button @action="updateMuscle">Update</Button>
      <Confirm
        v-model:isOpen="showDialogDeleteMuscle"
        @yes="deleteMuscle"
        class="flex h-10 items-center rounded-full bg-sonja-text px-4 text-red-600 shadow"
      >
        Delete
      </Confirm>
    </div>
  </Dialog>
</template>
