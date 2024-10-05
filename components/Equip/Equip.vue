<template>
  <div class="p-1" @click.prevent="showDialogWeight = workout ? true : false">
    <div class="font-bold">
      {{ equip.equip_name }} [{{ equip.equip_muscle_name }}]
    </div>
    <div>
      <div v-if="workout">this: {{ workout.equips[equip.id] }} kg</div>
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
      v-model:workout="workout"
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
}>();

const workout = defineModel<LoggedWorkout>("workout");

// const usersWeight = ref(
//   props.users?.map((user) => ({
//     userId: user.user_id,
//     user: user.name,
//     weight: undefined,
//     thisWeight: undefined,
//   })) ?? []
// );

// const getThisWeight = computed(() => {
//   const user = getWorker();
//   const userWeight = usersWeight.value.find(
//     (u) => u.userId === user?.user_id
//   )?.thisWeight;

//   if (userWeight === "tbd!") {
//     return user?.name + ": tbd!";
//   }
//   return user?.name + ": " + userWeight + " kg";
// });

// const getUserPB = (user: UserType | undefined) => {
//   const userWeight = usersWeight.value.find(
//     (u) => u.userId === user?.user_id
//   )?.weight;
//   if (userWeight === undefined) {
//     return "PB: tbd!";
//   }
//   return "PB: " + userWeight + " kg";
// };

// const getOtherPB = (user: UserType | undefined) => {
//   const userWeight = usersWeight.value.find(
//     (u) => u.userId === user?.user_id
//   )?.weight;
//   if (!userWeight) {
//     return user?.name + ": tbd!";
//   }
//   if (userWeight === undefined) {
//     return "tbd!";
//   }
//   return user?.name + ": " + userWeight + " kg";
// };

// const getLastWorkout = (user: number, equipId: number, workoutId: number) => {
//   fetch(`/api/weight/lastWorkout/${user}/${equipId}/${workoutId}`)
//     .then((res) => res.json())
//     .then((data) => {
//       const foundUser = usersWeight.value.find((u) => u.userId === user);
//       if (foundUser) {
//         foundUser.thisWeight = data[0]?.weight ?? "tbd!";
//       }
//     });
// };

// const getWorker = () => {
//   return props.users?.find(
//     (user) => user.user_id === props.logged.user?.user_id
//   );
// };

// const getOther = () => {
//   return props.users?.find(
//     (user) => user.user_id !== props.logged.user?.user_id
//   );
// };

// const getWeight = (user: number, equipId: number) => {
//   fetch(`/api/weight/${user}/${equipId}`)
//     .then((res) => res.json())
//     .then((data) => {
//       user === 1
//         ? (usersWeight.value[0].weight = data[0]?.weight)
//         : (usersWeight.value[1].weight = data[0]?.weight);
//     });
// };

// watchEffect(() => {
//   if (props.users) {
//     getWeight(1, props.equip.id);
//     getWeight(2, props.equip.id);
//     if (props.logged.workout) {
//       getLastWorkout(
//         props.logged.workout.user_id,
//         props.equip.id,
//         props.logged.workout.workout_id
//       );
//     }
//   }
// });
</script>
