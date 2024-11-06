import { defineEventHandler } from "h3";
import { deleteWorkout } from "../utils/removers";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "DELETE") {
      const { workout_id } = await readBody(event);
      const equips = await deleteWorkout(workout_id);
      return equips;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to add workout" };
  }
});
