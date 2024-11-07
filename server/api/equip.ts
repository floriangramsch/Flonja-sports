import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "DELETE") {
      // const { workout_id } = await readBody(event);
      // const equips = await deleteWorkout(workout_id);
      // return equips;
    }
    if (method === "GET") {
      const equips = await getEquips();
      return equips;
    }
    if (method === "POST") {
      const body = await readBody(event); // Holt den Body der POST-Anfrage
      const newEquip = body;

      const response = await addEquip(newEquip);
      return response;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle equip" };
  }
});
