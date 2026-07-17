import { defineEventHandler } from "h3";

function parsePlan(plan: any) {
  return {
    ...plan,
    days:
      typeof plan.days === "string"
        ? JSON.parse(plan.days)
        : plan.days || [],
  };
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {

    if (method === "DELETE") {
      const id = await readBody(event);
      const [rows] = await connection.execute(
        `DELETE FROM Plan WHERE id = ?`,
        [id],
      );
      return rows;
    }

    if (method === "GET") {
      const { workout_plan_id, user_id } = getQuery(event);

      if (workout_plan_id) {
        const [rows] = await connection.execute(
          `
          SELECT we.id, e.name, e.exercise_id, sets, reps, reps_to, info, e.type, metric, \`order\`,
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
        const parsed = rows.map((row: any) => ({
          ...row,
          categories: JSON.parse(row.categories),
        }));
        return parsed;
      }

      const baseQuery = `
        SELECT p.*,
          COALESCE(JSON_ARRAYAGG(pd.day), '[]') AS days
        FROM Plan p
        LEFT JOIN plan_days pd ON p.id = pd.plan_id
      `;

      if (user_id) {
        const [rows] = await connection.execute(
          `${baseQuery} WHERE p.user_id = ? GROUP BY p.id`,
          [user_id],
        );
        return rows.map(parsePlan);
      }

      const [rows] = await connection.execute(
        `${baseQuery} GROUP BY p.id`,
      );
      return rows.map(parsePlan);
    }

    if (method === "PUT") {
      const { id, day, remove } = await readBody(event);
      if (remove) {
        await connection.execute(
          `DELETE FROM plan_days WHERE plan_id = ? AND day = ?`,
          [id, day],
        );
      } else {
        await connection.execute(
          `INSERT IGNORE INTO plan_days (plan_id, day) VALUES (?, ?)`,
          [id, day],
        );
      }
      return { success: true };
    }

    if (method === "POST") {
      const { name, day, days, user_id } = await readBody(event);
      const planDays = days || (day ? [day] : []);
      const [result] = await connection.execute(
        `INSERT INTO Plan (name, user_id) VALUES (?, ?)`,
        [name, user_id],
      );
      const planId = result.insertId;
      for (const d of planDays) {
        await connection.execute(
          `INSERT IGNORE INTO plan_days (plan_id, day) VALUES (?, ?)`,
          [planId, d],
        );
      }
      return result;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout plan" };
  }
});
