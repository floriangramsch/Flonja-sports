import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "DELETE") {
      const { exercise_id } = await readBody(event);

      const [rows] = await connection.execute(
        `
        DELETE FROM Exercise 
        WHERE exercise_id = ?;
        `,
        [exercise_id],
      );
      return rows;
    }
    if (method === "GET") {
      const rows = await query(
        connection,
        `
          SELECT exercise_id, e.name AS exercise_name, c.category_id as category_id, c.name as category_name, info, type, metric
          FROM Exercise e
          LEFT JOIN Category c 
          ON c.category_id = e.category_id
        `,
        [],
      );
      return rows;
    }
    if (method === "PUT") {
      const { exercise_id, updatedData } = await readBody(event);
      const [rows] = await connection.execute(
        `UPDATE Exercise SET ${updatedData} WHERE exercise_id = ?`,
        [exercise_id],
      );
      return rows;
    }
    if (method === "POST") {
      const { name, category_id, type, metric } = await readBody(event);

      const response = await query(
        connection,
        `INSERT INTO Exercise (name, category_id, type, metric) VALUES (?, ?, ?, ?)`,
        [name, category_id, type, metric],
      );
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle exercise" };
  }
});
