import { defineEventHandler } from "h3";
import { NewStatsType } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  try {
    if (method === "DELETE") {
      const { stats_id } = await readBody(event);
      const connection = await connect();
      const [rows]: any = await connection.execute(
        `
        DELETE FROM Stats
        WHERE stats_id = ?
        `,
        [stats_id],
      );
      return rows;
    }
    if (method === "PUT") {
      const connection = await connect();

      const { stats_id, weight } = await readBody(event);
      const [rows] = await connection.execute(
        `
        UPDATE Stats
        SET body_weight = ?,
        WHERE stats_id = ?;
        `,
        [weight, stats_id],
      );
      return rows;
    }
    if (method === "GET") {
      const connection = await connect();

      const { id, type } = await getQuery(event);
      if (id) {
        const [rows]: any[] = await connection.execute(
          `
            SELECT stats_id, u.user_id, ${type}, date, name FROM Stats s
            LEFT JOIN User u ON u.user_id = s.user_id
            WHERE u.user_id = ?
            AND ? IS NOT NULL AND ? != 0
          `,
          [id, type, type],
        );

        if (rows.length === 0) {
          throw new Error("Keine Daten gefunden");
        }

        const res: { [key: string]: any[] } = {
          [rows[0].name]: [],
        };
        rows.forEach((element: { name: string; [key: string]: any }) => {
          res[element.name].push(element);
        });
        return res;
      } else {
        const [rows]: any[] = await connection.execute(
          `
            SELECT stats_id, u.user_id, ${type}, date, name FROM Stats s
            LEFT JOIN User u ON u.user_id = s.user_id
            WHERE (u.name = 'Florian' OR u.name = 'Sonja')
            AND ${type} IS NOT NULL AND ${type} != 0
          `,
        );
        const res: { Florian: any[]; Sonja: any[] } = {
          Florian: [],
          Sonja: [],
        };
        rows.forEach(
          (element: { name: "Florian" | "Sonja"; [key: string]: any }) => {
            res[element.name].push(element);
          },
        );
        return res;
      }
    }
    if (method === "POST") {
      const { user_id, form }: { user_id: number; form: NewStatsType } =
        await readBody(event);
      const connection = await connect();
      const values = Object.keys(form);
      const columns = values.join(", ");
      const placeholders = values.map(() => "?").join(", ");
      const sql = `
        INSERT INTO Stats (user_id, ${columns}) VALUES (?, ${placeholders})
      `;
      const inputs = [user_id, ...Object.values(form)];
      const [rows] = await connection.execute(sql, inputs);
      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle stats" };
  }
});
