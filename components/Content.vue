<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import ExerciseOverview from "./Exercises/ExerciseOverview.vue";

const logged = defineModel<any>("logged");
const show = defineModel<any>("show");
const workouts = defineModel<WorkoutType>("workouts");
const users = defineModel<UserType>("users");
const loggedWorkout = defineModel<any>("loggedWorkout");

const { data: equips } = useEquips();
const { data: muscles } = useMuscles();

const exerciseFilter = ref<number[]>([]);
</script>

<template>
  <div
    class="flex flex-col bg-sonja-bg text-sonja-text text-2xl flex-1 mt-20 pb-[5.7rem] overflow-y-auto"
  >
    <ExerciseOverview
      v-if="show.showRouter === 'exercises' && users"
      :users="users"
      v-model="equips"
      v-model:filter="exerciseFilter"
    />
    <WorkoutOverview
      v-if="show.showRouter === 'workouts' && users && workouts"
      :workouts="workouts"
      :users="users"
      v-model="logged"
      v-model:showRouter="show.showRouter"
    />
    <EquipList
      v-if="show.showRouter === 'equiplist' && equips && muscles && users"
      :equips="equips"
      :muscles="muscles"
      :users="users"
      :workout="loggedWorkout"
      v-model:filter="exerciseFilter"
      v-model:showRouter="show.showRouter"
    />
    <Home v-if="show.showRouter === 'home'" v-model="logged" />
  </div>
</template>
