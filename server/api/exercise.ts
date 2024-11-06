import { defineEventHandler } from "h3";
import { deleteExercise } from "../utils/removers";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "DELETE") {
      const { exercise_id } = await readBody(event);
      const equips = await deleteExercise(exercise_id);
      return equips;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to add Exercise" };
  }
});
