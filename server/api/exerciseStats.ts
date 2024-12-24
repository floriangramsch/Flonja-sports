import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "GET") {
      const [rows] = await connection.execute(
        `
        SELECT
        MAX(s.weight) AS max_weight,
        w.user_id,
        e.name AS exercise_name,
        c.category_id AS category_id,
        c.name AS category_name,
        e.exercise_id,
        u.name AS user_name,
        e.info,
        e.type,
        e.metric,
          (SELECT s2.weight
          FROM Sets s2
          LEFT JOIN Workout_Exercise we2 ON s2.workout_exercise_id = we2.workout_exercise_id
          LEFT JOIN Workout w2 ON w2.workout_id = we2.workout_id
          WHERE w2.user_id = w.user_id
            AND we2.exercise_id = e.exercise_id
          ORDER BY w2.start DESC, s2.id DESC
          LIMIT 1) AS last_weight
        FROM Exercise e
        LEFT JOIN Workout_Exercise we ON we.exercise_id = e.exercise_id
        LEFT JOIN Sets s ON s.workout_exercise_id = we.workout_exercise_id
        LEFT JOIN Workout w ON w.workout_id = we.workout_id
        LEFT JOIN Category c ON c.category_id = e.category_id
        LEFT JOIN User u ON u.user_id = w.user_id
        GROUP BY e.name, w.user_id, e.exercise_id, e.info, c.category_id, c.name, u.name;`,
        [],
      );
      return rows;
    }
  } catch (error) {
    return { error: "Failed to handle exercise stats" };
  }
});
