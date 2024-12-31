import { defineStore } from "pinia";

interface WorkoutExercise {
  workout_exercise_id?: number;
  exercise_name?: string;
  exercise_id?: number;
  categories: CategoryType[];
  type?: string;
  metric?: string;
}

export const useExToShowStore = defineStore("exToShow", {
  state: (): { wex: WorkoutExercise | undefined } => ({
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
    setExample(newExample: WorkoutExercise) {
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
