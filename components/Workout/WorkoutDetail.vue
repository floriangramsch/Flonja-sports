<script setup lang="ts">
import useExercisesByWorkout from "~/composables/Exercises/useExercisesByWorkout";

const props = defineProps<{
  equips: EquipType;
  workout: LoggedWorkout;
}>();

const show = defineModel<any>();

const filted = computed(() => {
  return Object.entries(props.equips).filter(([id, _]) => {
    return props.workout.equips[Number(id)] !== null;
  });
});

const { data: exercises } = useExercisesByWorkout(props.workout.id);
console.log(exercises);
</script>

<template>
  <!-- <div v-for="[id, f] in filted">
    {{ f.equip_name }}
    {{ f.FloLast }}
  </div> -->
  <div v-for="ex in exercises">
    {{ ex.name }}
    {{ ex.weight }}
  </div>
  <button
    class="w-full bg-sonja-bg-darker flex justify-center"
    @click="() => (show.showRouter = 'equipselection')"
  >
    <i class="fa-solid fa-plus text-3xl" />
  </button>
</template>
