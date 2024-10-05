import { defineEventHandler } from "h3";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Holt den Body der POST-Anfrage
    const userId = body;

    const response = await addWorkout(userId);
    return response; // Hier nur das Objekt zurückgeben
  } catch (error) {
    console.error(error);
    return { error: "Failed to add Equip" };
  }
});
