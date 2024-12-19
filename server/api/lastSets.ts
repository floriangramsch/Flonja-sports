import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();
  try {
    if (method === "POST") {
      const { exercise_id, user_id, start } = await readBody(event);
      const res = query(
        connection,
        `SELECT * FROM Sets s
          LEFT JOIN Workout_Exercise we ON we.workout_exercise_id = s.workout_exercise_id
          RIGHT JOIN Workout w ON w.workout_id = we.workout_id
          WHERE exercise_id = ?
          AND user_id = ?
          AND start = (
          SELECT MAX(start) FROM Sets s
            LEFT JOIN Workout_Exercise we ON we.workout_exercise_id = s.workout_exercise_id
            RIGHT JOIN Workout w ON w.workout_id = we.workout_id
            WHERE exercise_id = ?
            AND user_id = ?
            AND start < ?
          );`,
        [exercise_id, user_id, exercise_id, user_id, start],
      );
      return res;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle set" };
  }
});
