import { defineEventHandler } from "h3";
import { SetHelperType, SetType } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = await connect();

  try {
    if (method === "DELETE") {
      const { set_id } = await readBody(event);
      const res = query(connection, "DELETE FROM Sets WHERE id = ?", [set_id]);
      return res;
    }
    if (method === "PUT") {
      const { set_id, weight, reps } = await readBody(event);
      const [rows] = await connection.execute(
        `
        UPDATE Sets
        SET weight = ?, reps = ?
        WHERE id = ?;
        `,
        [weight, reps, set_id],
      );
      return rows;
    }
    if (method === "GET") {
      const { workout_exercise_id } = await getQuery(event);
      if (workout_exercise_id) {
        const res = query(
          connection,
          "SELECT * FROM Sets WHERE workout_exercise_id = ?",
          [workout_exercise_id],
        );
        return res;
      } else {
        const connection = await connect();
        // @ts-ignore
        const [rows] = await connection.execute<SetOriginalType[]>(
          `
          SELECT weight, reps, e.exercise_id, e.name AS exercise_name, start, u.name AS user_name 
          FROM Sets s
          LEFT JOIN Workout_Exercise we ON we.workout_exercise_id = s.workout_exercise_id
          LEFT JOIN Exercise e ON e.exercise_id = we.exercise_id
          LEFT JOIN Workout w ON w.workout_id = we.workout_id
          LEFT JOIN User u ON u.user_id = w.user_id
          ORDER BY w.start;
        `,
        );
        const groupedData = rows.reduce((acc: { [key: string]: any }, curr) => {
          const { exercise_name, exercise_id, user_name, weight, reps } = curr;

          // Wenn das Equip-Objekt noch nicht existiert, füge es hinzu
          if (!acc[exercise_name]) {
            acc[exercise_name] = { exercise_id, users: {} };
          }

          // Wenn der User noch nicht existiert, füge ihn hinzu
          if (!acc[exercise_name].users[user_name]) {
            acc[exercise_name].users[user_name] = [];
          }

          // Füge das Set (weight, reps) für den User hinzu
          acc[exercise_name].users[user_name].push({
            weight,
            reps,
            start: curr.start,
          });

          return acc;
        }, {});

        // Umstrukturieren der Daten in das gewünschte Format
        const result = Object.keys(groupedData).map((exercise_name) => {
          const { exercise_id, users } = groupedData[exercise_name];

          // Umwandlung der User-Daten
          const userArray = Object.keys(users).map((user) => ({
            user_name: user,
            sets: users[user],
          }));

          return {
            exercise_name: exercise_name,
            exercise_id,
            users: userArray,
          };
        });

        return result;
      }
    }
    if (method === "POST") {
      const { workout_exercise_id, weight, reps } = await readBody(event);

      const res = query(
        connection,
        "INSERT INTO Sets (workout_exercise_id, weight, reps) VALUES (?, ?, ?)",
        [workout_exercise_id, weight, reps],
      );
      return res
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle set" };
  }
});
