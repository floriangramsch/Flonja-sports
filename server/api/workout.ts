import { defineEventHandler } from "h3";
import { deleteWorkout } from "../utils/removers";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "DELETE") {
      const { workout_id } = await readBody(event);
      const response = await deleteWorkout(workout_id);
      return response;
    }
    if (method === "GET") {
      const workouts = await getWorkouts();
      return workouts;
    }
    if (method === "PUT") {
      const connection = await connect();

      const { workout_id, updatedData } = await readBody(event);
      const [rows] = await connection.execute(
        `UPDATE Workout SET ${updatedData} WHERE workout_id = ?`,
        [workout_id]
      );
      return rows;
    }
    if (method === "POST") {
      const body = await readBody(event); // Holt den Body der POST-Anfrage
      const { user } = body;

      const response = await addWorkout(user);
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle workout" };
  }
});
