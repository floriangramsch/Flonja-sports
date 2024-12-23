<template>
  <div class="p-1" @click.prevent="showDialogWeight = workout ? true : false">
    <div class="font-bold">
      {{ equip.exercise_name }} [{{ equip.category_name }}]
    </div>
    <div>
      <!-- <div v-if="workout">this: {{ workout.equips[equip.id] }} kg</div> -->
      <!-- <div>Flo: {{ equip.FloLast }} kg (PB: {{ equip.FloPB }} kg)</div>
      <div>Sonja: {{ equip.SonjaLast }} kg (PB: {{ equip.SonjaPB }} kg)</div> -->
    </div>
  </div>
  <Dialog
    v-if="workout"
    :isOpen="showDialogWeight"
    @close="showDialogWeight = false"
  >
    <NewWorkoutExercise
      :equip="equip"
      :workout="workout"
      @close="showDialogWeight = false"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "../Dialogs/Dialog.vue";
import NewWorkoutExercise from "../Dialogs/NewWorkoutExercise.vue";

const showDialogWeight = ref(false);

defineProps<{
  equip: EquipType;
  users: UserType;
  workout: WorkoutType | undefined;
}>();
</script>
