<script setup lang="ts">
const props = defineProps<{
  equips: EquipType;
  workout: LoggedWorkout;
}>();

const filted = computed(() => {
  return Object.entries(props.equips).filter(([id, _]) => {
    return props.workout.equips[Number(id)] !== null;
  });
});
</script>

<template>
  <div v-for="[id, f] in filted">
    {{ f.equip_name }}
    {{ f.FloLast }}
  </div>
</template>
