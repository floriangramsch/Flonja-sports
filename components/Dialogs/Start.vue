<template>
  <div
    class="absolute right-14 top-10 flex flex-col rounded-md border-2 border-sonja-akz bg-sonja-text text-xl text-sonja-akz2 shadow-lg"
  >
    <button class="px-4 py-2" @click.prevent="newWorkout">
      Neues Training
    </button>
    <button class="px-4 py-2" @click.prevent="resumeWorkout">
      Weiter trainieren
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  workouts: WorkoutType[] | undefined;
}>();

const logged = defineModel<LoggedType>();
const show = defineModel<any>("show");

const mutation = useAddWorkout();

const newWorkout = () => {
  if (!logged.value?.user?.id) return;
  mutation.mutate(logged.value.user?.id, {
    onSuccess: (data: any) => {
      logged.value = {
        isLogged: true,
        user: logged.value?.user,
        loggedWorkoutId: data.workoutId,
      };
    },
  });
};

const resumeWorkout = () => {
  if (props.workouts) {
    const latestWorkout = props.workouts
      .filter((workout) => workout.user_id === logged.value?.user?.id)
      .reduce((prev, curr) => {
        return new Date(prev.start) < new Date(curr.start) ? curr : prev;
      });
    logged.value = {
      isLogged: true,
      user: {
        id: latestWorkout.user_id,
        name: latestWorkout.name,
      },
      loggedWorkoutId: Number(latestWorkout.workout_id),
    };
  }
};
</script>
