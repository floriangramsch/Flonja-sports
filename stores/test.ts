import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: JSON.parse(localStorage.getItem('counter') || '0'),
  }),
  actions: {
    increment() {
      this.count++;
      localStorage.setItem('counter', JSON.stringify(this.count));
    },
  },
});
