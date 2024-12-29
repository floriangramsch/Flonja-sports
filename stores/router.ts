import { defineStore } from 'pinia';

export const useRouterStore = defineStore('router', {
  state: () => ({
    // route: "test",
    route: "workoutdetail",
  }),
  actions: {
    setRoute(route: RouterTypes) {
      this.route = route
    }
  }
});