import { defineEventHandler } from "h3";
import { addExercise } from "../utils/setters";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const { workout_id, exercise_id, weight } = await readBody(event);

    const equips = await addExercise({ workout_id, exercise_id, weight });
    return equips; 
  } catch (error) {
    console.error(error);
    return { error: "Failed to add Exercise" };
  }
});
