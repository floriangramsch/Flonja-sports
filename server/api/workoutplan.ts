import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "DELETE") {
      const id = await readBody(event);
      const [rows] = await connection.execute(
        `
        DELETE FROM Plan 
        WHERE id = ?;
        `,
        [id],
      );
      return rows;
    }
    if (method === "GET") {
      const { workout_plan_id } = getQuery(event);
      if (workout_plan_id) {
        const [rows] = await connection.execute(
          `
          SELECT * FROM Plan w
          LEFT JOIN Plan_Exercise we ON w.id = we.plan_id
          LEFT JOIN Exercise e ON e.exercise_id = we.exercise_id
          WHERE w.id = ?;
          `,
          [workout_plan_id],
        );
        return rows;
      } else {
        const [rows] = await connection.execute(
          `
          SELECT * FROM Plan w;
          `,
          [],
        );
        return rows;
      }
    }
    if (method === "PUT") {
    }
    if (method === "POST") {
      const { name, day } = await readBody(event);
      const query = day
        ? `INSERT INTO Plan (name, day) VALUES (?, ?);`
        : `INSERT INTO Plan (name) VALUES (?);`;
      const params = day ? [name, day] : [name];
      const [rows] = await connection.execute(query, params);
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout plan" };
  }
});
