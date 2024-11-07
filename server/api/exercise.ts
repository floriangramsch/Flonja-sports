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
    if (method === "GET") {
      const connection = await connect();

      const [rows] = await connection.execute(
        `
        Select e.equip_id, weight, start 
        FROM Equip eq 
        LEFT JOIN Exercice e ON eq.equip_id = e.equip_id 
        LEFT JOIN Workout w ON e.workout_id = w.workout_id
        `
      );
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to add Exercise" };
  }
});
