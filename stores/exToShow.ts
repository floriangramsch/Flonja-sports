import { defineStore } from "pinia";
import type { MaybeWorkoutExercise } from "~/utils/types";

export const useExToShowStore = defineStore("exToShow", {
  state: (): { wex: MaybeWorkoutExercise | undefined } => ({
    wex: {
      workout_exercise_id: undefined,
      exercise_name: undefined,
      exercise_id: undefined,
      categories: [],
      type: undefined,
      metric: undefined,
    },
  }),
  actions: {
    setExample(newExample: MaybeWorkoutExercise) {
      this.wex = newExample;
    },
    reset() {
      this.wex = undefined
      // this.wex = {
      //   workout_exercise_id: undefined,
      //   exercise_name: undefined,
      //   exercise_id: undefined,
      //   categories: [],
      //   type: undefined,
      //   metric: undefined,
      // };
    },
  },
  getters: {
    // uppercasedExample: (state) => state.wex.toUpperCase()
  },
});
