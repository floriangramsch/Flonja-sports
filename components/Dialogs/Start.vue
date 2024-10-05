<template>
  <div
    class="flex flex-col absolute bottom-24 left-48 bg-sonja-akz rounded-md shadow-lg text-2xl"
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

const logged = defineModel<LoggedType>();
const workouts = defineModel<WorkoutType>("workouts");

const newWorkout = () => {
  if (!logged.value || !logged.value.user) return;

  fetch("/api/addWorkout", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: logged.value?.user,
    }),
  })
    .then((res) => res.json())
    .then((data: LoggedWorkout) => {
      if (!logged.value || !logged.value.user || !workouts.value) return;
      const nullEquips = Object.keys(workouts.value?.[1]?.equips || {}).reduce(
        (acc, key) => {
          acc[Number(key)] = null;
          return acc;
        },
        {} as Record<number, number | null>
      );
      const newWorkout = {
        ...data,
        user: logged.value?.user,
        equips: nullEquips,
      };
      logged.value = {
        isLogged: true,
        user: logged.value?.user,
        workout: newWorkout,
      };
      workouts.value[newWorkout.id] = newWorkout;
    });
};

const resumeWorkout = () => {
  if (workouts) {
    const [latestKey, latestWorkout] = Object.entries(workouts.value || {})
      .filter(([key, workout]) => workout.user.id === logged.value?.user?.id)
      .reduce(([latestKey, latestWorkout], [currentKey, currentWorkout]) => {
        return new Date(currentWorkout.start) > new Date(latestWorkout.start)
          ? [currentKey, currentWorkout]
          : [latestKey, latestWorkout];
      });
    logged.value = {
      isLogged: true,
      user: logged.value?.user,
      workout: { id: Number(latestKey), ...latestWorkout },
    };
  }
};
</script>
