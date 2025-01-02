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
      const { workout_plan_id, user_id } = getQuery(event);
      if (workout_plan_id) {
        const rows = await connection.execute(
          `
          SELECT *,
          JSON_ARRAYAGG(JSON_OBJECT('id', c.category_id, 'name', c.name, 'type', c.type)) AS categories
          FROM Plan p
          LEFT JOIN Plan_Exercise we ON p.id = we.plan_id
          LEFT JOIN Exercise e ON e.exercise_id = we.exercise_id
          JOIN Exercise_Category ec ON e.exercise_id = ec.exercise_id
          JOIN Category c ON ec.category_id = c.category_id
          WHERE p.id = ? AND we.id IS NOT NULL
          GROUP BY e.exercise_id, p.id
          ORDER BY we.order;
          `,
          [workout_plan_id],
        );
        
        // @ts-ignore
        const parsedRows = rows[0].map((row: any) => ({
          ...row,
          categories: JSON.parse(row.categories),
        }));
  
        return parsedRows;
      } else if (user_id) {
        const [rows] = await connection.execute(
          `
          SELECT * FROM Plan p
          WHERE p.user_id = ?;
          `,
          [user_id],
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
      const { name, day, user_id } = await readBody(event);
      const query = day
        ? `INSERT INTO Plan (name, day, user_id) VALUES (?, ?, ?);`
        : `INSERT INTO Plan (name, user_id) VALUES (?, ?);`;
      const params = day ? [name, day, user_id] : [name, user_id];
      const [rows] = await connection.execute(query, params);
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout plan" };
  }
});
