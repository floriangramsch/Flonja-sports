import { defineEventHandler } from "h3";
import { addSet } from "../utils/setters";
import { getSets } from "../utils/getters";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  try {
    if (method === "DELETE") {
      // const { workout_id } = await readBody(event);
      // const equips = await deleteWorkout(workout_id);
      // return equips;
    }
    if (method === "GET") {
      const { exercise_id } = await getQuery(event);

      const sets = await getSets(Number(exercise_id));
      return sets;
    }
    if (method === "POST") {
      const { exercise_id, weight } = await readBody(event);

      const response = await addSet(exercise_id, weight);
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle set" };
  }
});
