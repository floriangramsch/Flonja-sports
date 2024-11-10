<script setup lang="ts">
import useAddExercise from "~/composables/Exercises/useAddExercise";
import SlideTransition from "../ui/transitions/SlideTransition.vue";

const props = defineProps<{
  workoutId: number;
  muscles: MuscleType;
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
  console.log(chosenMuscle.value);
  return props.equips.filter(
    (equip) => equip.muscle_name === chosenMuscle.value
  );
});

const showMuscleOverview = ref<boolean>(true);
const showEquipOverview = ref<boolean>(false);

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
  <SlideTransition>
    <div
      v-if="showMuscleOverview"
      class="grid grid-cols-3 place-items-center mt-10 absolute inset-0"
    >
      <div
        class="size-28 flex justify-center items-center border-4 border-sonja-bg-darker cursor-pointer overflow-auto"
        @click="chooseMuscle(muscle.muscle_name)"
        v-for="muscle in muscles"
        :key="muscle.muscle_group_id"
      >
        {{ muscle.muscle_name }}
      </div>
      <div class="w-full flex justify-center">
        <button
          class="bg-sonja-akz mt-10 text-white h-8 px-10 rounded-3xl shadow"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SlideTransition>

  <SlideTransition>
    <div v-if="showEquipOverview" class="flex flex-col absolute inset-0">
      <div
        v-for="equip in equipsToShow"
        @click="addNewExercice(Number(equip.equip_id))"
        class="cursor-pointer flex justify-center py-2 border-b-4 border-sonja-bg-darker"
      >
        {{ equip.equip_name }}
      </div>
      <div class="w-full flex justify-center">
        <button
          class="bg-sonja-akz mt-10 text-white h-8 px-10 rounded-3xl shadow"
          @click="
            showMuscleOverview = true;
            showEquipOverview = false;
          "
        >
          Close
        </button>
      </div>
    </div>
  </SlideTransition>
</template>
