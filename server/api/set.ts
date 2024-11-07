import { defineEventHandler } from "h3";
import { addSet } from "../utils/setters";
import { getSets } from "../utils/getters";
import { deleteSet } from "../utils/removers";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  try {
    if (method === "DELETE") {
      const { set_id } = await readBody(event);
      const response = await deleteSet(set_id);
      return response;
    }
    if (method === "GET") {
      const { exercise_id } = await getQuery(event);

      const sets = await getSets(Number(exercise_id));
      return sets;
    }
    if (method === "POST") {
      const { exercise_id, weight, reps } = await readBody(event);

      const response = await addSet(exercise_id, weight, reps);
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle set" };
  }
});
