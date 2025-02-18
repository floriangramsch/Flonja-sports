import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "GET") {
      const [rows] = await connection.execute(
        "SELECT category_id AS id, name, type FROM Category ORDER BY type, name",
      );
      return rows;
    }
    if (method === "POST") {
      const { newCategory, newType } = await readBody(event);

      const res = await query(
        connection,
        `INSERT INTO Category (name, type) VALUES (?, ?)`,
        [newCategory, newType],
      );
      return res;
    }
    if (method === "DELETE") {
      const { category_id } = await readBody(event);

      const connection = await connect();
      const [rows] = await connection.execute(
        `DELETE FROM Category WHERE category_id = ?`,
        [category_id],
      );

      return rows;
    }
    if (method === "PUT") {
      const connection = await connect();
      const body = await readBody(event);
      const { name, category_id, category_type } = body;

      const [rows] = await connection.execute(
        "UPDATE Category SET name = ?, type = ? WHERE category_id = ?",
        [name, category_type, category_id],
      );

      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle Category" };
  }
});
