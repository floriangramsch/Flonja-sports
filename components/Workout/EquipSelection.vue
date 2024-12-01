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

const exToShow = defineModel();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const chosenMuscle = ref<MuscleType>();
const chooseMuscle = (muscle: MuscleType) => {
  chosenMuscle.value = muscle;
  showMuscleOverview.value = false;
  showEquipOverview.value = true;
};

const equipsToShow = computed(() => {
  return props.equips.filter(
    (equip) => equip.muscle_name === chosenMuscle.value?.muscle_name,
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
      onSuccess: (res) => {
        exToShow.value = {
          equipName: props.equips.find((equip) => equip.equip_id === equipId)
            ?.equip_name,
          equip_id: equipId,
          exercice_id: res.id,
        };
        emit("close");
      },
    },
  );
};
</script>

<template>
  <!-- Muscle Selection -->
  <SlideTransition>
    <div v-if="showMuscleOverview">
      <div class="flex w-full justify-evenly py-4">
        <button
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="emit('close')"
        >
          <i class="fa-solid fa-arrow-left" />
        </button>
        <div class="text-center text-4xl font-bold">Muskel</div>
        <div></div>
      </div>
      <div
        class="inset-0 grid grid-cols-3 place-items-center gap-2 overflow-auto"
      >
        <div
          class="flex size-28 cursor-pointer items-center justify-center overflow-auto border-4 border-sonja-bg-darker"
          @click="chooseMuscle(muscle)"
          v-for="muscle in muscles"
          :key="muscle.muscle_group_id"
        >
          {{ muscle.muscle_name }}
        </div>
        <Dialog :isOpen="showDialogMuscle" @close="showDialogMuscle = false">
          <template v-slot:trigger>
            <div
              class="flex size-28 cursor-pointer items-center overflow-auto border-4 border-black bg-sonja-text text-center text-sonja-akz2"
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
      <div class="flex w-full justify-evenly py-4">
        <button
          class="flex h-10 items-center rounded-full bg-sonja-bg-darker px-4 text-sonja-text shadow"
          @click="
            showMuscleOverview = true;
            showEquipOverview = false;
          "
        >
          <i class="fa-solid fa-arrow-left" />
        </button>
        <div class="text-center text-4xl font-bold">Equipment</div>
        <div class=""></div>
      </div>
      <div class="absolute inset-0 mt-16 flex flex-col">
        <div
          v-for="equip in equipsToShow"
          @click="addNewExercice(Number(equip.equip_id))"
          class="flex cursor-pointer justify-center border-b-4 border-sonja-bg-darker py-2"
        >
          {{ equip.equip_name }}
        </div>
        <Dialog :isOpen="showDialogEquip" @close="showDialogEquip = false">
          <template v-slot:trigger>
            <Button @action="showDialogEquip = true"> Neues Gerät </Button>
          </template>
          <NewEquip
            @close="showDialogEquip = false"
            :muscleId="chosenMuscle?.muscle_group_id"
          />
        </Dialog>
      </div>
    </div>
  </SlideTransition>
</template>
