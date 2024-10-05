import { defineEventHandler } from "h3";
import { getWorkouts } from "../utils/getters";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const equips = await getWorkouts();
    return equips; // Hier nur das Objekt zurückgeben
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch workouts" };
  }
});
