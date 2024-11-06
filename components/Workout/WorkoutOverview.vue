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
          <button
            class="ml-5"
            @click.stop="
              showConfirmation = true;
              workoutToDelete = id;
            "
          >
            <i class="fa-solid fa-close text-2xl text-sonja-akz" />
          </button>
        </div>
        <div class="pl-3">
          von
          {{ workout.user.name }}
        </div>
      </div>
    </div>
    <div
      v-if="showConfirmation"
      class="flex flex-col justify-center items-center fixed bg-sonja-akz p-12 py-14 w-48 h-20 top-1/4 left-1/4 text-sonja-akz2 rounded shadow"
    >
      <div>Sure?</div>
      <div class="flex gap-4 mt-2">
        <button
          class="p-2 bg-sonja-text text-sonja-akz2 rounded"
          @click="
            deleteWorkout();
            showConfirmation = false;
          "
        >
          Yes
        </button>
        <button
          class="p-2 bg-sonja-text text-sonja-akz2 rounded"
          @click="showConfirmation = false"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useDeleteWorkout from "~/composables/Workouts/useDeleteWorkout";

defineProps<{
  workouts: WorkoutType;
  users: UserType;
}>();

const logged = defineModel<LoggedType>();
const showRouter = defineModel("showRouter");
const showConfirmation = ref<boolean>(false);
const workoutToDelete = ref<number>();

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
const deleteWorkout = () => {
  if (workoutToDelete.value) {
    mutation.mutate(workoutToDelete.value, {
      onSuccess: () => {
        if (logged.value) {
          logged.value.isLogged = false;
          logged.value.loggedWorkout = undefined;
        }
      },
    });
  }
};
</script>
