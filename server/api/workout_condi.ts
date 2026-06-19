import { defineEventHandler } from "h3";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "GET") {
      const { id } = getQuery(event);
      if (id) {
        const res = await query(
          connection,
          `
            SELECT we.workout_exercise_id, ex.name, weight
            FROM Workout_Exercise we
            LEFT JOIN Exercise ex
              ON we.exercise_id = ex.exercise_id
            JOIN Exercise_Category ec
              ON ex.exercise_id = ec.exercise_id
            JOIN Category c
              ON ec.category_id = c.category_id
            LEFT JOIN Sets s
              ON s.workout_exercise_id = we.workout_exercise_id
            WHERE we.workout_id = ?
              AND c.name = 'Cardio'
            ORDER BY we.workout_exercise_id;
          `,
          [id],
        );

        return res;
      }
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to get Workout_Exercise" };
  }
});
