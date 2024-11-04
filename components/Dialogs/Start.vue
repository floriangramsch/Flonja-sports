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
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const props = defineProps<{
  workouts: WorkoutType | undefined;
}>();

const logged = defineModel<LoggedType>();
const show = defineModel<any>("show");

const mutation = useMutation({
  mutationFn: async (userId: number) => {
    const response = await fetch("/api/addWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add workout");
    }

    return response.json();
  },
  onSuccess: (data: any) => {
    queryClient.invalidateQueries({ queryKey: ["workouts"] });

    // if (!logged.value || !logged.value.user || !workouts.value) return;
    // const nullEquips = Object.keys(workouts.value?.[1]?.equips || {}).reduce(
    //   (acc, key) => {
    //     acc[Number(key)] = null;
    //     return acc;
    //   },
    //   {} as Record<number, number | null>
    // );
    // const newWorkout = {
    //   ...data,
    //   user: logged.value?.user,
    //   equips: nullEquips,
    // };
    logged.value = {
      isLogged: true,
      user: logged.value?.user,
      loggedWorkout: data.workoutId,
    };
    // workouts.value[newWorkout.id] = newWorkout;
  },
});

const newWorkout = () => {
  console.log("id", logged.value);
  if (!logged.value?.user?.id) return;
  mutation.mutate(logged.value.user?.id);
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
