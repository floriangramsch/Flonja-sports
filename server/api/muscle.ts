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
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout" };
  }
});
