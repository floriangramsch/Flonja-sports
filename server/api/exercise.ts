import { defineEventHandler } from "h3";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "DELETE") {
      const { workout_exercise_id } = await readBody(event);
      const res = query(
        connection,
        `DELETE FROM Workout_Exercise WHERE workout_exercise_id = ?`,
        [workout_exercise_id],
      );
      return res
    }
    if (method === "GET") {
      const [rows] = await connection.execute(
        `
        Select we.exercise_id, weight, start 
        FROM Workout_Exercise e 
        LEFT JOIN Workout_Exercise we ON e.exercise_id = we.exercise_id 
        LEFT JOIN Workout w ON we.workout_id = w.workout_id
        `,
      );
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to get Workout_Exercise" };
  }
});
