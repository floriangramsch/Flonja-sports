import { defineEventHandler } from "h3";

// API-Handler für die Ausrüstung
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "GET") {
      const { id } = await getQuery(event);
      if (id) {
        const res = await query(
          connection,
          `
            SELECT 
            workout_exercise_id, we.exercise_id, e.name AS exercise_name, 
            JSON_ARRAYAGG(JSON_OBJECT('id', c.category_id, 'name', c.name, 'type', c.type)) AS categories, 
            e.type, e.metric 
            FROM Workout_Exercise we 
            LEFT JOIN Exercise e ON e.exercise_id = we.exercise_id
            JOIN Exercise_Category ec ON e.exercise_id = ec.exercise_id
            JOIN Category c ON ec.category_id = c.category_id
            WHERE workout_id = ?
            GROUP BY we.workout_exercise_id, e.name, e.type, e.metric;
          `,
          [id],
        );
        const parsedRows = res.map((row: any) => ({
          ...row,
          categories: JSON.parse(row.categories),
        }));
        
        return parsedRows;
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
