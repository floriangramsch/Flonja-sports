import { defineStore } from 'pinia';

export const useRouterStore = defineStore('router', {
  state: () => ({
    route: "workoutpage",
    workoutRoute: "home",
  }),
  actions: {
    setRoute(route: RouterTypes) {
      this.route = route
    },
    setWorkoutRoute(route: WorkoutRouterTypes) {
      this.workoutRoute = route
    }
  }
});