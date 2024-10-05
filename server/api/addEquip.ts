import { defineEventHandler } from "h3";
import { addEquip } from "../utils/setters";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Holt den Body der POST-Anfrage
    const newEquip = body;

    const equips = await addEquip(newEquip);
    return equips; // Hier nur das Objekt zurückgeben
  } catch (error) {
    console.error(error);
    return { error: "Failed to add Equip" };
  }
});
