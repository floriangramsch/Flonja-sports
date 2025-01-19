export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "GET") {
      const connection = await connect();

      const [rows] = await connection.execute(
        "SELECT user_id, name, rest_time, work_body_id FROM User",
      );
      return rows;
    }
    if (method === "PUT") {
      const connection = await connect();
      const { user_id, rest_time } = await readBody(event);

      const [rows] = await connection.execute(
        `
          UPDATE User SET rest_time = ?
          WHERE user_id = ?
        `,
        [rest_time, user_id],
      );
      return rows;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
});
