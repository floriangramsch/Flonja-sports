import { defineEventHandler } from "h3";
import { addSet } from "../utils/setters";
import { getSets } from "../utils/getters";
import { deleteSet } from "../utils/removers";
import { SetType } from "~/utils/types";

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
      if (exercise_id) {
        const sets = await getSets(Number(exercise_id));
        return sets;
      } else {
        const connection = await connect();
        // @ts-ignore
        const [rows] = await connection.execute<SetType[]>(
          `
          SELECT weight, reps, eq.equip_id, eq.name AS equip_name, start, u.name AS user_name FROM \`Set\` s
          LEFT JOIN Exercice e ON e.exercice_id = s.exercise_id
          LEFT JOIN Equip eq ON eq.equip_id = e.equip_id
          LEFT JOIN Workout w ON w.workout_id = e.workout_id
          LEFT JOIN User u ON u.user_id = w.user_id;
        `
        );
        const groupedData = rows.reduce((acc: { [key: string]: any }, curr) => {
          const { equip_name, equip_id, user_name, weight, reps } = curr;

          // Wenn das Equip-Objekt noch nicht existiert, füge es hinzu
          if (!acc[equip_name]) {
            acc[equip_name] = { equip_id, users: {} };
          }

          // Wenn der User noch nicht existiert, füge ihn hinzu
          if (!acc[equip_name].users[user_name]) {
            acc[equip_name].users[user_name] = [];
          }

          // Füge das Set (weight, reps) für den User hinzu
          acc[equip_name].users[user_name].push({
            weight,
            reps,
            start: curr.start,
          });

          return acc;
        }, {});

        // Umstrukturieren der Daten in das gewünschte Format
        const result = Object.keys(groupedData).map((equipName) => {
          const { equip_id, users } = groupedData[equipName];

          // Umwandlung der User-Daten
          const userArray = Object.keys(users).map((user) => ({
            user_name: user,
            sets: users[user],
          }));

          return {
            equip_name: equipName,
            equip_id,
            users: userArray,
          };
        });

        return result;
      }
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
