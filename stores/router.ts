import { defineStore } from 'pinia';

export const useRouterStore = defineStore('router', {
  state: () => ({
    // route: "test",
    route: "workoutdetail",
  }),
  actions: {
    toggleVisibility(route: string) {
      this.route = route;
    },
  }
});