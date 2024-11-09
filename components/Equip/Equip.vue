<template>
  <div class="p-1" @click.prevent="showDialogWeight = workout ? true : false">
    <div class="font-bold">
      {{ equip.equip_name }} [{{ equip.equip_muscle_name }}]
    </div>
    <div>
      <!-- <div v-if="workout">this: {{ workout.equips[equip.id] }} kg</div> -->
      <div>Flo: {{ equip.FloLast }} kg (PB: {{ equip.FloPB }} kg)</div>
      <div>Sonja: {{ equip.SonjaLast }} kg (PB: {{ equip.SonjaPB }} kg)</div>
    </div>
  </div>
  <Dialog
    v-if="workout"
    :isOpen="showDialogWeight"
    @close="showDialogWeight = false"
  >
    <NewEx
      :equip="equip"
      :workout="workout"
      @close="showDialogWeight = false"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "../Dialogs/Dialog.vue";
import NewEx from "../Dialogs/NewEx.vue";

const showDialogWeight = ref(false);

defineProps<{
  equip: EquipSpecialType;
  users: UserType;
  workout: WorkoutType | undefined;
}>();
</script>
