<script setup lang="ts">
import useDeleteExercise from "~/composables/Exercises/useDeleteExercise";
import { useGetSets } from "~/composables/useSets";
import Button from "../ui/buttons/Button.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Confirm from "../Dialogs/Confirm.vue";
import { useUpdateEquip } from "~/composables/useEquips";

const props = defineProps<{
  exercise: any;
  workoutInfo: {
    start: Date;
    user_id: number;
  };
  equip: EquipType | undefined;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const mutation = useDeleteExercise();
const deleteSetMutation = useDeleteSet();
const { data: sets } = useGetSets(props.exercise.exercice_id);
const addSetMutation = useAddSet();
const { data: lastSets } = useGetLastSets({
  equip_id: props.exercise.equip_id,
  user_id: props.workoutInfo?.user_id,
  start: props.workoutInfo?.start,
});

const removeExercise = () => {
  mutation.mutate(props.exercise.exercice_id, {
    onSuccess: () => {
      showConfirmDeleteExercise.value = false;
      emit("close");
    },
  });
};

const setToDelete = ref<number>();
const removeSet = (id: number) => {
  deleteSetMutation.mutate(id, {
    onSuccess: () => (showConfirmDeleteSet.value = false),
  });
};

const addSet = () => {
  if (newWeight.value && newReps.value) {
    addSetMutation.mutate(
      {
        exercise_id: props.exercise.exercice_id,
        weight: newWeight.value,
        reps: newReps.value,
      },
      {
        onSuccess: () => {
          showOldSets.value = false;
          showUpdateExerciseDialog.value = false;
          // newWeight.value = undefined;
          newReps.value = undefined;
        },
      }
    );
  }
};

const updateEquipMutation = useUpdateEquip();
const updateInfo = () => {
  if (props.equip) {
    updateEquipMutation.mutate(
      {
        updatedData: `info = '${newInfo.value}'`,
        equip_id: props.equip.equip_id,
      },
      {
        onSuccess: () => {
          editInfo.value = false;
        },
      }
    );
  }
};

const showUpdateExerciseDialog = ref<boolean>(false);
const showConfirmDeleteSet = ref<boolean>(false);
const showConfirmDeleteExercise = ref<boolean>(false);
const showOldSets = ref<boolean>(false);
const showInfo = ref<boolean>(false);
const editInfo = ref<boolean>(!props.equip?.info);

const newInfo = ref<string | undefined>(props.equip?.info);
const newWeight = ref<number>();
const newReps = ref<number>();

const infoRef = ref<HTMLTextAreaElement | null>(null);

watch(
  () => infoRef.value,
  (newVal) => {
    if (newVal) newVal.focus();
  }
);
</script>

<template>
  <div class="absolute inset-0 pb-52">
    <!-- Header -->
    <div class="w-full flex justify-evenly py-4 px-4">
      <button
        class="flex items-center bg-sonja-bg-darker text-sonja-text h-10 px-4 rounded-full shadow"
        @click="emit('close')"
      >
        <i class="fa-solid fa-arrow-left" />
      </button>
      <div class="text-4xl font-bold text-center">
        {{ exercise.equipName }}
      </div>
      <Confirm
        v-model:isOpen="showConfirmDeleteExercise"
        @yes="removeExercise"
        class="flex items-center bg-sonja-bg-darker text-red-800 h-10 px-4 rounded-full shadow"
      >
        <i class="fa-solid fa-close" />
      </Confirm>
    </div>
    <!-- Buttons -->
    <div class="flex w-full justify-center mb-5">
      <!-- Switch between current and old sets -->
      <button
        class="text-3xl"
        :class="lastSets?.length === 0 ? 'opacity-50' : ''"
        :disabled="lastSets?.length === 0"
        @click="showOldSets = !showOldSets"
      >
        <i class="fa-solid fa-repeat" />
      </button>
      <!-- Open Info -->
      <button
        class="text-3xl absolute right-9 text-sonja-text"
        @click="showInfo = true"
      >
        <i class="fa-solid fa-info" />
      </button>
    </div>
    <!-- Sets -->
    <div>
      <!-- Current Sets -->
      <div
        v-if="!showOldSets"
        v-for="set in sets"
        class="flex justify-between m-2 pr-6 pb-2 border-b-2 border-sonja-bg-darker rounded-lg"
      >
        <div class="flex flex-col">
          <div>Reps: {{ set.reps }}</div>
          <div>Gewicht: {{ set.weight }}</div>
        </div>

        <button
          @click="
            setToDelete = set.id;
            showConfirmDeleteSet = true;
          "
        >
          <i class="fa-solid fa-close" />
        </button>
      </div>
      <!-- Last Sets -->
      <div
        v-if="showOldSets"
        v-for="set in lastSets"
        class="flex justify-between m-2 pr-6 pb-2 border-b-2 bg-sonja-akz rounded-lg"
      >
        <div class="flex flex-col">
          <div>Reps: {{ set.reps }}</div>
          <div>Gewicht: {{ set.weight }}</div>
        </div>
      </div>
    </div>
    <div v-if="sets?.length === 0 && !showOldSets">
      <div
        class="bg-sonja-bg-darker rounded-t-3xl w-full h-20 flex justify-center items-center text-3xl font-bold cursor-pointer"
        @click="() => (showUpdateExerciseDialog = true)"
      >
        New Set
      </div>
    </div>
    <!-- Add Set -->
    <button
      v-if="!showOldSets"
      @click="showUpdateExerciseDialog = true"
      class="flex w-full justify-center bg-sonja-bg-darker rounded-t rounded-full pt-1 -mt-2"
    >
      <i class="fa-solid fa-plus text-4xl"></i>
    </button>
    <!-- Delete Set Confirmation -->
    <Confirm
      v-model:isOpen="showConfirmDeleteSet"
      @yes="removeSet(Number(setToDelete))"
    />
    <!-- New Rep/Weigt -->
    <Dialog
      :isOpen="showUpdateExerciseDialog"
      @close="showUpdateExerciseDialog = false"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="grid grid-cols-2 gap-2">
          Reps:
          <UiNumberInput v-model:modelValue="newReps" focus />
          Weight:
          <UiNumberInput v-model:modelValue="newWeight" />
        </div>
        <Button @action="addSet"> Done </Button>
      </div>
    </Dialog>
    <!-- Info -->
    <Dialog
      :isOpen="showInfo"
      @close="
        showInfo = false;
        equip?.info ? (editInfo = false) : (editInfo = true);
      "
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div
          v-if="!editInfo"
          @click="editInfo = true"
          class="flex flex-col w-48 h-48 border-2 border-sonja-text p-2 rounded shadow bg-sonja-text text-sonja-akz2 whitespace-pre"
        >
          {{ equip?.info }}
        </div>
        <div class="flex flex-col gap-4" v-else>
          <textarea
            class="w-48 h-48 border-2 border-sonja-text rounded p-2 shadow bg-sonja-text text-sonja-akz2 focus:ring-2 focus:ring-sonja-akz focus:outline-none"
            v-model="newInfo"
            ref="infoRef"
          />
          <Button @action="updateInfo"> Done </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
