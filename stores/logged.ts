import { defineStore } from "pinia";

interface LoggedState {
  logged: {
    isLogged: boolean;
    user: {
      id: number;
      name: string;
    };
    loggedWorkoutId: number | undefined;
  };
}

export const useLoggedStore = defineStore("logged", {
  state: (): LoggedState => ({
    logged: {
      isLogged: false,
      user: {
        id: 1,
        name: "Florian",
      },
      loggedWorkoutId: undefined,
    },
  }),
  getters: {
    getLogged: (state) => state.logged,
  },
  actions: {
    initializeLogged() {
      if (typeof window !== "undefined") {
        const savedLogged = localStorage.getItem("logged");
        if (savedLogged) {
          this.logged = JSON.parse(savedLogged);
        }
      }
    },
    logout() {
      if (typeof window !== "undefined") {
        this.logged = {
          isLogged: false,
          user: this.logged.user,
          loggedWorkoutId: undefined,
        };
        localStorage.setItem("logged", JSON.stringify(this.logged));
      }
    },
    toStorage() {
      if (typeof window !== "undefined") {
        localStorage.setItem("logged", JSON.stringify(this.logged));
      }
    },
  },
});
