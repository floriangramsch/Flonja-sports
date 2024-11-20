import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "DELETE") {
      // const { workout_id } = await readBody(event);
      // const response = await deleteWorkout(workout_id);
      // return response;
    }
    if (method === "GET") {
      const connection = await connect();

      const [rows] = await connection.execute(
        "SELECT muscle_group_id, name AS muscle_name FROM MuscleGroup"
      );
      return rows;
    }
    if (method === "POST") {
      const body = await readBody(event); // Holt den Body der POST-Anfrage
      const { newMuscle } = body;

      const response = await addMuscle(newMuscle);
      return response;
    }
    if (method === "DELETE") {
      const { muscle_id } = await readBody(event);

      const connection = await connect();
      const [rows] = await connection.execute(
        `DELETE FROM MuscleGroup WHERE muscle_group_id = ?`,
        [muscle_id]
      );

      return rows;
    }
    if (method === "PUT") {
      const connection = await connect();
      const body = await readBody(event);
      const { name, muscle_id } = body;

      const [rows] = await connection.execute(
        "UPDATE MuscleGroup SET name = ? WHERE muscle_group_id = ?",
        [name, muscle_id]
      );

      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout" };
  }
});
