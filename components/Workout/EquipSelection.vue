<script setup lang="ts">
import useAddExercise from "~/composables/Exercises/useAddExercise";
import SlideTransition from "../ui/transitions/SlideTransition.vue";
import Dialog from "../Dialogs/Dialog.vue";
import Button from "../ui/buttons/Button.vue";
import NewMuskle from "../Dialogs/NewMuskle.vue";
import NewEquip from "../Dialogs/NewEquip.vue";

const props = defineProps<{
  workoutId: number;
  muscles: MuscleType[];
  equips: EquipType[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const chosenMuscle = ref<string>();
const chooseMuscle = (id: string) => {
  chosenMuscle.value = id;
  showMuscleOverview.value = false;
  showEquipOverview.value = true;
};

const equipsToShow = computed(() => {
  return props.equips.filter(
    (equip) => equip.muscle_name === chosenMuscle.value
  );
});

const showMuscleOverview = ref<boolean>(true);
const showDialogMuscle = ref<boolean>(false);
const showEquipOverview = ref<boolean>(false);
const showDialogEquip = ref<boolean>(false);

const mutation = useAddExercise();

const addNewExercice = (equipId: number) => {
  mutation.mutate(
    {
      workout_id: props.workoutId,
      equip_id: equipId,
    },
    {
      onSuccess: () => emit("close"),
    }
  );
};
</script>

<template>
  <!-- Muscle Selection -->
  <SlideTransition>
    <div v-if="showMuscleOverview">
      <div class="w-full flex justify-evenly py-4">
        <button
          class="flex items-center bg-sonja-bg-darker text-sonja-text h-10 px-4 rounded-full shadow"
          @click="emit('close')"
        >
          <i class="fa-solid fa-arrow-left" />
        </button>
        <div class="text-4xl font-bold text-center">Muskel</div>
        <div></div>
      </div>
      <div
        class="grid grid-cols-3 place-items-center gap-2 inset-0 overflow-auto"
      >
        <div
          class="size-28 flex justify-center items-center border-4 border-sonja-bg-darker cursor-pointer overflow-auto"
          @click="chooseMuscle(muscle.muscle_name)"
          v-for="muscle in muscles"
          :key="muscle.muscle_group_id"
        >
          {{ muscle.muscle_name }}
        </div>
        <Dialog :isOpen="showDialogMuscle" @close="showDialogMuscle = false">
          <template v-slot:trigger>
            <div
              class="size-28 flex text-center items-center bg-sonja-text text-sonja-akz2 border-4 border-black cursor-pointer overflow-auto"
              @click="showDialogMuscle = true"
            >
              Neuer Muskle
            </div>
          </template>
          <NewMuskle @close="showDialogMuscle = false" />
        </Dialog>
      </div>
    </div>
  </SlideTransition>

  <!-- Equip Selection -->
  <SlideTransition>
    <div v-if="showEquipOverview">
      <div class="w-full flex justify-evenly py-4">
        <button
          class="flex items-center bg-sonja-bg-darker text-sonja-text h-10 px-4 rounded-full shadow"
          @click="
            showMuscleOverview = true;
            showEquipOverview = false;
          "
        >
          <i class="fa-solid fa-arrow-left" />
        </button>
        <div class="text-4xl font-bold text-center">Equipment</div>
        <div class=""></div>
      </div>
      <div class="flex flex-col mt-16 absolute inset-0">
        <div
          v-for="equip in equipsToShow"
          @click="addNewExercice(Number(equip.equip_id))"
          class="cursor-pointer flex justify-center py-2 border-b-4 border-sonja-bg-darker"
        >
          {{ equip.equip_name }}
        </div>
        <Dialog :isOpen="showDialogEquip" @close="showDialogEquip = false">
          <template v-slot:trigger>
            <Button @action="showDialogEquip = true"> Neues Gerät </Button>
          </template>
          <NewEquip @close="showDialogEquip = false" />
        </Dialog>
      </div>
    </div>
  </SlideTransition>
</template>
