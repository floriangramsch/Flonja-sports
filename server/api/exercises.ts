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
          SELECT e.exercise_id, e.name AS exercise_name, info, e.type, metric,
          JSON_ARRAYAGG(JSON_OBJECT('id', c.category_id, 'name', c.name, 'type', c.type)) AS categories
          FROM Exercise e
          JOIN Exercise_Category ec ON e.exercise_id = ec.exercise_id
          JOIN Category c ON ec.category_id = c.category_id
          GROUP BY 
            e.exercise_id;
        `,
        [],
      );
      const parsedRows = rows.map((row: any) => ({
        ...row,
        categories: JSON.parse(row.categories),
      }));

      return parsedRows;
    }
    if (method === "PUT") {
      const { exercise_id, updatedData, categorieIds } = await readBody(event);
      const [rows] = await connection.execute(
        `UPDATE Exercise SET ${updatedData} WHERE exercise_id = ?`,
        [exercise_id],
      );

      const placeholders = categorieIds.map(() => "?").join(", ");
      await query(
        connection,
        `DELETE FROM Exercise_Category 
         WHERE exercise_id = ? 
         AND category_id NOT IN (${placeholders})`,
        [exercise_id, ...categorieIds],
      );

      for (const categoryId of categorieIds) {
        await query(
          connection,
          `
            INSERT INTO Exercise_Category (exercise_id, category_id)
            SELECT ?, ?
            WHERE NOT EXISTS (
              SELECT 1 FROM Exercise_Category ec 
              WHERE ec.exercise_id = ? AND ec.category_id = ?
            );
          `,
          [exercise_id, categoryId, exercise_id, categoryId]
        );
      }

      return rows;
    }
    if (method === "POST") {
      const { name, category_ids, type, metric } = await readBody(event);

      const response = await query(
        connection,
        `INSERT INTO Exercise (name, type, metric) VALUES (?, ?, ?)`,
        [name, type, metric],
      );
      
      for (const category_id of category_ids) {
        await query(
          connection,
          `INSERT INTO Exercise_Category (exercise_id, category_id) VALUES (?, ?)`,
          [response.insertId, category_id],
        );
      }
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle exercise" };
  }
});
