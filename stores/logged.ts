import { useQueryClient } from "@tanstack/vue-query";
import { defineStore } from "pinia";

interface LoggedState {
  logged: {
    isLogged: boolean;
    user: {
      id?: number;
      name?: string;
    };
    loggedWorkoutId?: number;
  };
}

export const useLoggedStore = defineStore("logged", {
  state: (): LoggedState => ({
    logged: {
      isLogged: false,
      user: {
        id: undefined,
        name: undefined,
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
        // const queryClient = useQueryClient()
        // const existingData = queryClient.getQueryData(["isLogged"]);
        // if (existingData) {
        //   this.logged.isLogged = existingData.isLogged;
        //   this.logged.user = existingData.user || {};
        //   return;
        // }
        // useCheckLogin();
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
        this.toStorage();
      }
    },
    logoutComplete() {
      if (typeof window !== "undefined") {
        this.logged = {
          isLogged: false,
          user: {
            id: undefined,
            name: undefined,
          },
          loggedWorkoutId: undefined,
        };
        this.toStorage();
      }
    },
    setUser(id: number, name: string) {
      if (this.logged.user.id === id) return;
      this.logout();
      this.logged.user.id = id;
      this.logged.user.name = name;
      this.toStorage();
    },
    toStorage() {
      if (typeof window !== "undefined") {
        localStorage.setItem("logged", JSON.stringify(this.logged));
      }
    },
  },
});
