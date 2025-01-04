import { defineEventHandler } from "h3";

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

      const { id } = await getQuery(event);
      if (id) {
        const [rows]: any[] = await connection.execute(
          `
            SELECT stats_id, u.user_id, body_weight, date, name FROM Stats s
            LEFT JOIN User u ON u.user_id = s.user_id
            WHERE u.user_id = ?
          `,
          [id],
        );

        if (rows.length === 0) {
          throw new Error("Keine Daten gefunden");
        }

        const dynamicName = rows[0].name;

        const res: { [key: string]: any[] } = {
          [dynamicName]: [],
        };
        rows.forEach((element: { name: string; [key: string]: any }) => {
          res[element.name].push(element);
        });
        return res;
      } else {
        console.log('begor')
        const [rows]: any[] = await connection.execute(
          `
            SELECT stats_id, u.user_id, body_weight, date, name FROM Stats s
            LEFT JOIN User u ON u.user_id = s.user_id
            WHERE u.name = 'Florian' OR u.name = 'Sonja'
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
      const { user_id, weight } = await readBody(event);
      const connection = await connect();
      const [rows] = await connection.execute(
        `
          INSERT INTO Stats (user_id, body_weight) Values (?, ?)
        `,
        [user_id, weight],
      );

      return rows;
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to handle stats" };
  }
});
