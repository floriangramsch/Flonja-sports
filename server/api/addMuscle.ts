import { defineEventHandler } from "h3";
import { addMuscle } from "../utils/setters";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Holt den Body der POST-Anfrage
    const { newMuscle } = body;

    const equips = await addMuscle(newMuscle);
    return equips; // Hier nur das Objekt zurückgeben
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch workouts" };
  }
});
