export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "GET") {
    }
    const connection = await connect();

    const [rows] = await connection.execute("SELECT * FROM User");
    return rows;
  } catch (error) {
    console.log(error);
    return error;
  }
});
