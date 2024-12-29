import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "GET") {
      const [rows] = await connection.execute(
        "SELECT category_id AS id, name FROM Category",
      );
      return rows;
    }
    if (method === "POST") {
      const { newCategory } = await readBody(event);

      const res = await query(
        connection,
        `INSERT INTO Category (name) VALUES (?)`,
        [newCategory],
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
      const { name, category_id } = body;

      const [rows] = await connection.execute(
        "UPDATE Category SET name = ? WHERE category_id = ?",
        [name, category_id],
      );

      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle Category" };
  }
});
