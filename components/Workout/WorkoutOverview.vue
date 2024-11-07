<template>
  <div>
    <div
      class="flex flex-col snap-y snap-mandatory overflow-y-auto no-scrollbar cursor-pointer"
    >
      <div
        v-for="(workout, id) in workouts"
        @click="editWorkout({ ...workout, id })"
        class="p-1 flex flex-col min-w-full snap-start bg-sonja-bg border-b border-sonja-akz"
        :key="id"
      >
        <div class="flex">
          {{ formatTime(workout.start) }}
          <Confirm
            v-bind:is-open="showConfirmation"
            class="ml-5"
            @yes="deleteWorkout(id)"
          >
            <i class="fa-solid fa-close text-2xl text-sonja-akz" />
          </Confirm>
        </div>
        <div class="pl-3">
          von
          {{ workout.user.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useDeleteWorkout from "~/composables/Workouts/useDeleteWorkout";
import Confirm from "../Dialogs/Confirm.vue";

defineProps<{
  workouts: WorkoutType;
  users: UserType;
}>();

const logged = defineModel<LoggedType>();
const showRouter = defineModel("showRouter");
const showConfirmation = ref<boolean>(false);

const editWorkout = (workout: {
  start: Date;
  end: Date;
  user: LoggedUser;
  id: number;
}) => {
  logged.value = {
    user: workout.user,
    isLogged: true,
    loggedWorkout: workout.id,
  };
  showRouter.value = "equiplist";
};

const mutation = useDeleteWorkout();
const deleteWorkout = (id: number) => {
  if (id) {
    mutation.mutate(id, {
      onSuccess: () => {
        if (logged.value) {
          logged.value.isLogged = false;
          logged.value.loggedWorkout = undefined;
          showConfirmation.value = false;
        }
      },
    });
  }
};
</script>
