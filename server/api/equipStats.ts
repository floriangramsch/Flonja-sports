import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "GET") {
      const connection = await connect();
      const [rows] = await connection.execute(
        `SELECT
            MAX(s.weight) AS max_weight,
            w.user_id,
            eq.name,
            m.muscle_group_id AS muscle_id,
            m.name AS muscle_name,
            eq.equip_id,
            u.name AS user_name,
        (SELECT s2.weight
            FROM \`Set\` s2
            LEFT JOIN Exercice e2 ON s2.exercise_id = e2.exercice_id
            LEFT JOIN Workout w2 ON w2.workout_id = e2.workout_id
            WHERE w2.user_id = w.user_id
              AND e2.equip_id = e.equip_id
            ORDER BY w2.start DESC, s2.id DESC
            LIMIT 1) AS last_weight
        FROM \`Set\` s
        LEFT JOIN Exercice e ON s.exercise_id = e.exercice_id
        LEFT JOIN Equip eq ON eq.equip_id = e.equip_id
        LEFT JOIN Workout w ON w.workout_id = e.workout_id
        LEFT JOIN MuscleGroup m ON m.muscle_group_id = eq.muscle_group_id
        LEFT JOIN User u ON u.user_id = w.user_id
        GROUP BY name, user_id`,
        []
      );
      console.log(rows);
      return rows;
    }
  } catch (error) {
    return { error: "Failed to handle equip stats" };
  }
});