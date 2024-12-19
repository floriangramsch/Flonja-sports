import { defineEventHandler } from "h3";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  const connection = await connect();

  try {
    const { id } = await readBody(event); // Holt den Body der POST-Anfrage

    const res = query(
      connection,
        `SELECT workout_exercise_id, e.name AS exercise_name, we.exercise_id, e.category_id, c.name AS category_name, type, metric 
      FROM Workout_Exercise we 
      LEFT JOIN Exercise e ON e.exercise_id = we.exercise_id
      LEFT JOIN Category c ON e.category_id = c.category_id
      WHERE workout_id = ?;`,
      [id],
    );
    return res
  } catch (error) {
    console.error(error);
    return { error: "Failed to get Exercises" };
  }
});
