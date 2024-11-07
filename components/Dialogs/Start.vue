<template>
  <div
    class="flex flex-col absolute top-1 right-10 text-sonja-text bg-sonja-akz rounded-md shadow-lg text-xl"
  >
    <button class="bg-sonja-akz px-4 py-2 rounded" @click.prevent="newWorkout">
      Neues Training
    </button>
    <button
      class="bg-sonja-akz px-4 py-2 rounded"
      @click.prevent="resumeWorkout"
    >
      Weiter trainieren?
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  workouts: WorkoutType | undefined;
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
        loggedWorkout: data.workoutId,
      };
    },
  });
};

const resumeWorkout = () => {
  if (props.workouts) {
    const [latestKey, latestWorkout] = Object.entries(props.workouts || {})
      .filter(([key, workout]) => workout.user.id === logged.value?.user?.id)
      .reduce(([latestKey, latestWorkout], [currentKey, currentWorkout]) => {
        return new Date(currentWorkout.start) > new Date(latestWorkout.start)
          ? [currentKey, currentWorkout]
          : [latestKey, latestWorkout];
      });
    logged.value = {
      isLogged: true,
      user: logged.value?.user,
      loggedWorkout: Number(latestKey),
    };
    show.value.showRouter = "workoutdetail";
  }
};
</script>
