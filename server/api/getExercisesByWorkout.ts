import { defineEventHandler } from "h3";
import { getExercisesByWorkout } from "../utils/getters";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event); // Holt den Body der POST-Anfrage

    const response = await getExercisesByWorkout(id);
    return response;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get Exercises" };
  }
});
