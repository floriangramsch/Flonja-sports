<script setup lang="ts">
import useAddExercise from "~/composables/Exercises/useAddExercise";

const props = defineProps<{
  workoutId: number;
  muscles: MuscleType;
  equips: EquipType;
}>();

const show = defineModel<any>();

const chosenMuscle = ref<string>();
const chooseMuscle = (id: string) => {
  chosenMuscle.value = id;
  showMuscleOverview.value = false;
  showEquipOverview.value = true;
};

const equipsToShow = computed(() => {
  return Object.entries(props.equips).filter(
    ([, equip]) => equip.equip_muscle_name === chosenMuscle.value
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
      onSuccess: () => (show.value.showRouter = "workoutdetail"),
    }
  );
};
</script>

<template>
  <div
    v-if="showMuscleOverview"
    class="grid grid-cols-3 gap-2 place-items-center mt-10"
  >
    <div
      class="w-28 h-28 flex justify-center items-center border-4 border-sonja-bg-darker cursor-pointer"
      @click="chooseMuscle(muscle.muscle_name)"
      v-for="muscle in muscles"
      :key="muscle.muscle_group_id"
    >
      {{ muscle.muscle_name.substring(0, 5) }}
    </div>
  </div>
  <div v-if="showEquipOverview" class="flex flex-col">
    <div
      v-for="[id, equip] in equipsToShow"
      @click="addNewExercice(Number(id))"
      class="cursor-pointer flex justify-center py-2 border-b-4 border-sonja-bg-darker"
    >
      {{ equip.equip_name }}
    </div>
  </div>
</template>
