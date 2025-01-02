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
      const { updateOrder, id, order, form } = await readBody(event);
      if (updateOrder) {
        const query = `
          UPDATE Plan_Exercise
          SET \`order\` = ?
          WHERE id = ?;
        `;
        const params = [order, id];
        const [rows] = await connection.execute(query, params);
        return rows;
      } else {
        const query = `
          UPDATE Plan_Exercise
          SET sets = ?, reps = ?, reps_to = ?
          WHERE id = ?;
        `;
        const params = [form.sets, form.reps, form.reps_to, form.plan_id];
        const [rows] = await connection.execute(query, params);
        return rows;
      }
    }
    if (method === "POST") {
      const { plan_id, exercise_id, sets, reps, reps_to, order } =
        await readBody(event);
      const query = `
      INSERT INTO Plan_Exercise (plan_id, exercise_id, sets, reps, reps_to, \`order\`) 
      VALUES (?, ?, ?, ?, ?, ?);`;
      const params = [plan_id, exercise_id, sets, reps, reps_to, order];
      const [rows] = await connection.execute(query, params);
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout plan exercises" };
  }
});
