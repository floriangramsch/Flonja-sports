<template>
  <div
    class="flex flex-col snap-y snap-mandatory overflow-y-auto no-scrollbar cursor-pointer"
  >
    <div
      @click="editWorkout(workout)"
      class="p-1 flex flex-col min-w-full snap-start bg-sonja-bg border-b border-sonja-akz"
      v-for="(workout, id) in workouts"
      :key="id"
    >
      <div>
        {{ formatTime(workout.start) }}
      </div>
      <div class="pl-3">
        von
        {{ workout.user.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  workouts: WorkoutType;
  users: UserType;
}>();

const logged = defineModel();
const showRouter = defineModel("showRouter");

const editWorkout = (workout: { start: Date; end: Date; user: LoggedUser }) => {
  logged.value = {
    user: workout.user,
    isLogged: true,
    workout: workout,
  };
  showRouter.value = "equiplist";
};
</script>
