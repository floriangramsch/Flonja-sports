import { defineStore } from "pinia";

export const useWorkoutExerciseFilterStore = defineStore(
  "workoutExerciseFilter",
  {
    state: (): {
      ids: number[],
      searchTerm: string,
      category: string
    } => ({
      ids: [],
      searchTerm: "",
      category: "all",
    }),
    actions: {
      reset() {
        this.ids = []
      },
      addId(id: number) {
        this.ids.push(id)
      },
      setId(id: number) {
        this.ids = [id]
      },
      setSearchTerm(term: string) {
        this.searchTerm = term;
      },
      setCategory(category: string) {
        this.category = category;
      },
    },
    // getters: {
    //   filteredItems: (state) => {
    //     return state.items.filter(
    //       (item) =>
    //         item.name.includes(state.searchTerm) &&
    //         (state.category === "all" || item.category === state.category),
    //     );
    //   },
    // },
  },
);
