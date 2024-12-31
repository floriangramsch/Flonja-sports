import { defineStore } from "pinia";

interface Plan {
  id?: number;
  name?: string;
  day?: number;
}

export const usePlanStore = defineStore("plan", {
  state: (): { plan: Plan | undefined } => ({
    plan: {
      id: undefined,
      name: undefined,
      day: undefined
  },
  }),
  actions: {
    setPlan(newPlan: Plan) {
      this.plan = newPlan;
    },
    reset() {
      this.plan = undefined
    },
  },
  getters: {
    // uppercasedExample: (state) => state.wex.toUpperCase()
  },
});
