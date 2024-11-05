import { defineEventHandler } from "h3";
import { addExercise } from "../utils/setters";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const { workout_id, equip_id, weight } = await readBody(event); // Holt den Body der POST-Anfrage

    const equips = await addExercise({ workout_id, equip_id, weight });
    return equips; // Hier nur das Objekt zurückgeben
  } catch (error) {
    console.error(error);
    return { error: "Failed to add Exercise" };
  }
});
