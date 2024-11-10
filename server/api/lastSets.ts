import { defineEventHandler } from "h3";
import { addSet } from "../utils/setters";
import { getLastSets, getSets } from "../utils/getters";
import { deleteSet } from "../utils/removers";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  try {
    if (method === "POST") {
      const { equip_id, user_id, start } = await readBody(event);

      const response = await getLastSets(equip_id, user_id, start);
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle set" };
  }
});
