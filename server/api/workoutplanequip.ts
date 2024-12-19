import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "DELETE") {
      const id = await readBody(event);
      const [rows] = await connection.execute(
        `
        DELETE FROM Plan_Exercise 
        WHERE id = ?;
        `,
        [id],
      );
      return rows;
    }
    if (method === "PUT") {
    }
    if (method === "POST") {
      const { plan_id, exercise_id, sets, reps } = await readBody(event);
      const query = `INSERT INTO Plan_Exercise (plan_id, exercise_id, sets, reps) VALUES (?, ?, ?, ?);`;
      const params = [plan_id, exercise_id, sets, reps];
      const [rows] = await connection.execute(query, params);
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout plan exercises" };
  }
});
