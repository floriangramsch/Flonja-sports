import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "DELETE") {
      const id = await readBody(event);
      const [rows] = await connection.execute(
        `
        DELETE FROM WorkoutPlan 
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
          SELECT * FROM WorkoutPlan w
          LEFT JOIN WorkoutPlanEquip we ON w.id = we.workout_plan_id
          LEFT JOIN Equip eq ON eq.equip_id = we.equip_id
          WHERE w.id = ?;
          `,
          [workout_plan_id],
        );
        return rows;
      } else {
        const [rows] = await connection.execute(
          `
          SELECT * FROM WorkoutPlan w;
          `,
          [],
        );
        return rows;
      }
    }
    if (method === "PUT") {
      // const connection = await connect();
      // const { workout_id, updatedData } = await readBody(event);
      // const [rows] = await connection.execute(
      //   `UPDATE Workout SET ${updatedData} WHERE workout_id = ?`,
      //   [workout_id]
      // );
      // return rows;
    }
    if (method === "POST") {
      const { name, day } = await readBody(event);
      const query = day
        ? `INSERT INTO WorkoutPlan (name, day) VALUES (?, ?);`
        : `INSERT INTO WorkoutPlan (name) VALUES (?);`;
      const params = day ? [name, day] : [name];
      const [rows] = await connection.execute(query, params);
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout plan" };
  }
});
