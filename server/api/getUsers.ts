export default defineEventHandler(async (event) => {
  const connection = await connect();

  const [rows] = await connection.execute("SELECT * FROM User");
  return rows;
});
