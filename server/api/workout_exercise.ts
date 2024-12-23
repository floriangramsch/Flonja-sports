import { defineEventHandler } from "h3";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "GET") {
      const { id } = await getQuery(event);
      if (id) {
        const res = query(
          connection,
          `
            SELECT workout_exercise_id, e.name AS exercise_name, we.exercise_id, e.category_id, c.name AS category_name, type, metric 
            FROM Workout_Exercise we 
            LEFT JOIN Exercise e ON e.exercise_id = we.exercise_id
            LEFT JOIN Category c ON e.category_id = c.category_id
            WHERE workout_id = ?;
          `,
          [id],
        );
        return res;
      }
    }
    if (method === "DELETE") {
      const { workout_exercise_id } = await readBody(event);
      const res = query(
        connection,
        `DELETE FROM Workout_Exercise WHERE workout_exercise_id = ?`,
        [workout_exercise_id],
      );
      return res;
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
    if (method === "POST") {
      const { workout_id, exercise_id, weight } = await readBody(event);
      const sql = `
        INSERT INTO Workout_Exercise (workout_id, exercise_id${
          weight !== undefined ? ", weight" : ""
        }) VALUES (?, ?${weight !== undefined ? ", ?" : ""})
      `;

      const params = [workout_id, exercise_id];

      if (weight !== undefined) {
        params.push(Number(weight));
      }

      const results = await query(connection, sql, params);
      return results;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to get Workout_Exercise" };
  }
});
