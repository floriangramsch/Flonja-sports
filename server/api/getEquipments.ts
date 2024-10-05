import { defineEventHandler } from "h3";
import { getEquips } from "../utils/getters";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const equips = await getEquips();
    return equips; // Hier nur das Objekt zurückgeben
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch equips" };
  }
});
